import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallBack from '@/components/admin/ErrorFallBack';
import Statistics from '@/components/admin/home/Statistics';
import Loading from '@/components/admin/Loading';
import BorrowRecords from '@/components/admin/home/BorrowRecords';
import AccountRequests from '@/components/admin/home/AccountRequests';
import RecentBooks from '@/components/admin/home/RecentBooks';

const page = () => {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallBack}>
        <Suspense fallback={<Loading />}>
          <Statistics />
        </Suspense>
      </ErrorBoundary>
      <div className='mt-5 flex gap-5'>
        <div className="flex flex-1 flex-col gap-5">
          <ErrorBoundary FallbackComponent={ErrorFallBack}>
            <Suspense fallback={<Loading />}>
              <BorrowRecords />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary FallbackComponent={ErrorFallBack}>
            <Suspense fallback={<Loading />}>
              <AccountRequests />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="flex-1">
          <ErrorBoundary FallbackComponent={ErrorFallBack}>
            <Suspense fallback={<Loading />}>
              <RecentBooks />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  )
};

export default page;