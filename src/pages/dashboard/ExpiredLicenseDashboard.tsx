import { LayoutWrapper, Navbar } from "@/components";

export const ExpiredLicenseDashboard = () => {
  return (
    <>
      <Navbar />
      <LayoutWrapper as='section'>
        <p className='text-center text-sm text-white/70 py-20'>Debes renovar tu licencia</p>
      </LayoutWrapper>
    </>
  );
}
