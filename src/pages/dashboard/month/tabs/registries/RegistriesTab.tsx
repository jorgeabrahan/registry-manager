import {
  dbGetMonthRegistries,
  dbRemoveRegistry,
  dbRemoveSelectedRegistries
} from '@/firebase/db/registries';
import { useConfirmModal } from '@/hooks';
import {
  CurrentRegistryType,
  MergedRegistriesType,
  RegistryType
} from '@/lib/types/registries';
import { formatDateFriendly } from '@/lib/utils';
import {
  mergeRegistries,
  sortRegistriesNewestFirst
} from '@/lib/utils/registryUtils';
import { MergedRegistriesModal } from '@/modals/mergedRegistries';
import { navStore, registriesStore } from '@/zustand';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { RegistriesNav } from './RegistriesNav';
import { Registry } from './Registry';
import { selectedRegistryStore } from './selectedRegistriesStore';
import { toast } from 'sonner';
import { MONTHS } from '@/pages/dashboard/constants';

export const RegistriesTab: React.FC<RegistriesTabProps> = ({
  uid = '',
  year = '',
  month = '',
  handleNewRegistry = () => {},
  handleEditRegistry = () => {},
  handleDisableBreadcrumb = () => {}
}) => {
  const { showConfirmModal } = useConfirmModal();
  const [monthFetched, setMonthFetched] = useState(false);
  const [loadingContiguousMonth, setLoadingContiguousMonth] = useState(false);
  const storeRegistries = registriesStore();
  const { selectedRegistries, clearSelectedRegistries } =
    selectedRegistryStore();
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const { setIsNavDisabled } = navStore();
  const [mergedRegistries, setMergedRegistries] =
    useState<MergedRegistriesType | null>(null);
  /* effect to enable and disable breadcrumb, and navbar whenever the isBusy state changes */
  useEffect(() => {
    handleDisableBreadcrumb(isBusy || !monthFetched);
    setIsNavDisabled(isBusy || !monthFetched);
  }, [isBusy, monthFetched, handleDisableBreadcrumb, setIsNavDisabled]);
  /* effect to enable the breadcrumb, and navbar before unmounting this component */
  useEffect(() => {
    return () => {
      handleDisableBreadcrumb(false);
      setIsNavDisabled(false);
    };
  }, [handleDisableBreadcrumb, setIsNavDisabled]);
  /* effect to clear the selected registries when the component mounts */
  useEffect(() => {
    if (selectedRegistries.length > 0) clearSelectedRegistries();
  }, []);
  /* fetch registries from database */
  useEffect(() => {
    const emptyMessage = `No hay registros en ${month.toLowerCase()} del ${year}.`;
    const key = `${year}-${month}`;
    // if month is in store
    if (storeRegistries.months[key]) {
      if (storeRegistries.months[key].length === 0) setMessage(emptyMessage);
      else setMessage('');
      setMonthFetched(true);
      return;
    }
    if (monthFetched) return;
    setMessage('Cargando...');
    dbGetMonthRegistries(uid, year, month)
      .then((res) => {
        if (!res.ok) {
          setMessage(res?.error ?? '');
          return;
        }
        if (res.registries.length === 0) setMessage(emptyMessage);
        else setMessage('');
        storeRegistries.addMonth(year, month, res?.registries);
      })
      .catch(() => {
        setMessage('Error al obtener los registros del mes.');
      })
      .finally(() => setMonthFetched(true));
  }, [uid, year, month, monthFetched, storeRegistries]);
  const handleReload = () => {
    clearSelectedRegistries();
    storeRegistries.removeMonth(year, month);
    setMonthFetched(false);
  };
  const handleCreate = () => {
    clearSelectedRegistries();
    handleNewRegistry(uuid());
  };
  const handleRemove = (registry: RegistryType) => {
    clearSelectedRegistries();
    showConfirmModal({
      message: `¿Seguro que desea eliminar el registro del ${formatDateFriendly(
        registry.date
      )}?`,
      onConfirm: () => {
        setIsBusy(true);
        const errorMessage = 'El registro no pudo ser eliminado.';
        const tIdRemoveLoading = toast.loading('Eliminando registro');
        dbRemoveRegistry(uid, year, month, registry?.id)
          .then((res) => {
            if (!res.ok) {
              toast.dismiss(tIdRemoveLoading);
              toast.error(errorMessage);
              return;
            }
            toast.dismiss(tIdRemoveLoading);
            storeRegistries.removeRegistry(year, month, registry?.id);
            toast.success('El registro se elimino exitosamente.');
          })
          .catch(() => {
            toast.dismiss(tIdRemoveLoading);
            toast.error(errorMessage);
          })
          .finally(() => setIsBusy(false));
      }
    });
  };
  const handleRemoveSelected = () => {
    const afterRemovingSelected = () => {
      storeRegistries?.removeRegistries(year, month, selectedRegistries);
      clearSelectedRegistries();
    };
    const removeSelectedRegistries = async () => {
      const tIdRemoveSelected = toast.loading(
        'Eliminando registros seleccionados'
      );
      try {
        const res = await dbRemoveSelectedRegistries(
          uid,
          year,
          month,
          selectedRegistries
        );
        if (!res.ok) {
          toast.dismiss(tIdRemoveSelected);
          toast.error(res?.error ?? '');
          return;
        }
        toast.dismiss(tIdRemoveSelected);
        toast.success(res?.success ?? '');
        afterRemovingSelected();
      } catch (_) {
        toast.dismiss(tIdRemoveSelected);
        toast.error('No se pudieron eliminar los registros seleccionados.');
      } finally {
        setIsBusy(false);
      }
    };
    showConfirmModal({
      message: '¿Seguro que desea eliminar los registros seleccionados?',
      onConfirm: () => {
        setIsBusy(true);
        removeSelectedRegistries();
      }
    });
  };
  const handleCombineSelected = () => {
    const currentMonthRegistries = storeRegistries.months[`${year}-${month}`];
    const selected = currentMonthRegistries.filter(
      (reg) => selectedRegistries.find((id) => id === reg.id) != null
    );
    setMergedRegistries(mergeRegistries(selected));
  };
  // const handleCombineWeek = () => {
  //   const currentMonthRegistries = storeRegistries.months[`${year}-${month}`];
  //   const currentDate = new Date();
  //   const startOfWeek =
  //     currentDate.getDate() -
  //     currentDate.getDay() +
  //     (currentDate.getDay() === 0 ? -6 : 1);
  //   const endOfWeek = startOfWeek + 6;
  //   const startDate = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth(),
  //     startOfWeek
  //   ).toISOString();
  //   const endDate = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth(),
  //     endOfWeek
  //   ).toISOString();
  //   console.log(startOfWeek, endOfWeek);

  //   const weekRegistries = currentMonthRegistries.filter((registry) => {
  //     const registryDate = new Date(registry.date);
  //     return (
  //       registryDate >= new Date(startDate) && registryDate <= new Date(endDate)
  //     );
  //   });
  //   setMergedRegistries(mergeRegistries(weekRegistries));
  // };

  const handleCombineWeek = async () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentWeekday = currentDate.getDay();

    const startOfWeekDay =
      currentDay - currentWeekday + (currentWeekday === 0 ? -6 : 1);
    const endOfWeekDay = startOfWeekDay + 6;

    const startDate = new Date(currentYear, currentMonth, startOfWeekDay);
    const endDate = new Date(currentYear, currentMonth, endOfWeekDay);

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    const needsPrevMonth =
      startMonth !== currentMonth || startYear !== currentYear;
    const needsNextMonth = endMonth !== currentMonth || endYear !== currentYear;

    const formatKey = (y: number, m: number) => `${y}-${MONTHS[m]}`;

    const fetchIfNeeded = async (year: number, month: number) => {
      const key = formatKey(year, month);
      if (!storeRegistries.months[key]) {
        setLoadingContiguousMonth(true);
        const res = await dbGetMonthRegistries(
          uid,
          String(year),
          MONTHS[month]
        );
        if (res.ok) {
          storeRegistries.addMonth(String(year), MONTHS[month], res.registries);
          setLoadingContiguousMonth(false);
          return res.registries;
        } else {
          console.error(`Error al cargar ${key}:`, res.error);
          setLoadingContiguousMonth(false);
          return [];
        }
      } else {
        return storeRegistries.months[key];
      }
    };

    const prevMonthRegistries = needsPrevMonth
      ? await fetchIfNeeded(startYear, startMonth)
      : [];
    const nextMonthRegistries = needsNextMonth
      ? await fetchIfNeeded(endYear, endMonth)
      : [];

    const currentKey = formatKey(currentYear, currentMonth);
    const currentMonthRegistries = storeRegistries.months[currentKey] || [];

    const allRegistries = [
      ...prevMonthRegistries,
      ...currentMonthRegistries,
      ...nextMonthRegistries
    ];

    const weekRegistries = allRegistries.filter((registry) => {
      const registryDate = new Date(registry.date);
      return registryDate >= startDate && registryDate <= endDate;
    });

    setMergedRegistries(mergeRegistries(weekRegistries));
  };

  const handleEdit = (registry: RegistryType) => {
    clearSelectedRegistries();
    const registryCopy = { ...registry, isEditing: true };
    handleEditRegistry(registryCopy);
  };
  return (
    <>
      <RegistriesNav
        year={year}
        month={month}
        isFetching={!monthFetched || loadingContiguousMonth}
        handleReload={handleReload}
        handleCreate={handleCreate}
        handleRemoveSelected={handleRemoveSelected}
        handleCombineSelected={handleCombineSelected}
        handleCombineWeek={handleCombineWeek}
      />
      {message?.length !== 0 && (
        <p className='text-center text-sm text-white/70 py-20'>{message}</p>
      )}
      <section className='grid gap-5 my-5'>
        {sortRegistriesNewestFirst(
          storeRegistries.months[`${year}-${month}`]
        )?.map((registry) => (
          <Registry
            key={registry?.id}
            registry={registry}
            handleRegistryRemove={() => handleRemove(registry)}
            handleRegistryEdit={() => handleEdit(registry)}
            isBusy={isBusy}
          />
        ))}
      </section>
      {mergedRegistries != null && (
        <MergedRegistriesModal
          handleHideModal={() => setMergedRegistries(null)}
          mergedRegistries={mergedRegistries}
        />
      )}
    </>
  );
};

type RegistriesTabProps = {
  uid?: string;
  year?: string;
  month?: string;
  handleNewRegistry?: (registryId: string) => void;
  handleEditRegistry?: (registry: CurrentRegistryType) => void;
  handleDisableBreadcrumb?: (isDisabled: boolean) => void;
};
