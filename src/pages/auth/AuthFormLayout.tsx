
export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => {
  return (
    <section className='h-screen flex justify-center items-center mx-2 sm:mx-4'>
      <div className='bg-shark-900 max-w-[600px] w-full mx-auto p-5 rounded-2xl'>
        {children}
      </div>
    </section>
  )
}

type AuthFormLayoutProps = {
  children: React.ReactNode
}
