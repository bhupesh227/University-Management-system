
import React from 'react'
import { getBorrowRecords } from '@/lib/admin/actions/book';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BookCover from '@/components/BookCover';
import Avatar from '@/components/Avatar';
import dayjs from 'dayjs';
import Menu from '@/components/admin/Menu';
import { borrowStatuses } from '@/constants';
import BookReceipt from '@/components/BookReceipt';
import Pagination from '@/components/Pagination';
const page = async ({ searchParams }: PageProps) => {

    const { query, sort, page } = await searchParams;

    const { data: allRecords, metadata } = await getBorrowRecords({
        query,
        sort,
        page,
    });


  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <h2 className="text-xl font-semibold">Borrow Book Requests</h2>

      <div className="mt-7 w-full overflow-hidden">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow className="h-14 border-none bg-light-300">
              <TableHead className="w-72">Book Title</TableHead>
              <TableHead>User Requested</TableHead>
              <TableHead>Borrowed Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allRecords!?.length > 0 ? (
              allRecords!.map((record) => (
                <TableRow
                  key={record.borrow.id}
                  className="border-b-dark-100/5"
                >
                  <TableCell className="py-5 font-medium">
                    <div className="flex w-72 flex-row items-center gap-2 text-sm font-semibold text-dark-400">
                      <BookCover
                        variant="extraSmall"
                        coverImage={record.coverUrl}
                        coverColor={record.coverColor}
                      />
                      <p className="flex-1">{record.title}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    <div className="flex flex-row items-center gap-2">
                      <Avatar name={record.user.fullName} size="md" />
                      <div>
                        <p className="font-semibold text-dark-400">
                          {record.user.fullName}
                        </p>
                        <p className="text-dark-100">{record.user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm font-medium text-dark-200">
                    {dayjs(record.borrow.borrowDate).format("MMM DD, YYYY")}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-dark-200">
                    {record.borrow.returnDate
                      ? dayjs(record.borrow.returnDate).format("MMM DD, YYYY")
                      : "---"}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-dark-200">
                    {dayjs(record.borrow.dueDate).format("MMM DD, YYYY")}
                  </TableCell>
                  <TableCell>
                    <Menu
                      label="Change Status"
                      initialValue={record.borrow.status!.toLowerCase()}
                      items={borrowStatuses}
                    />
                  </TableCell>
                  <TableCell>
                    <BookReceipt
                      btnVariant="admin"
                      {...(record as BorrowedBook)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="pt-10 text-center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <Pagination variant="light" hasNextPage={metadata?.hasNextPage} />
      </div>
    </section>
  )
}

export default page