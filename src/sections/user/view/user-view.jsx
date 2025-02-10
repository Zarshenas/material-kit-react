import { useState, useCallback, useEffect } from "react"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Table from "@mui/material/Table"
import Button from "@mui/material/Button"
import TableBody from "@mui/material/TableBody"
import Typography from "@mui/material/Typography"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"

import Cookies from "js-cookie"
import { Users } from "src/api/Users"
import { DashboardContent } from "src/layouts/dashboard"

import { Iconify } from "src/components/iconify/iconify"
import { Scrollbar } from "src/components/scrollbar/scrollbar"

import { TableNoData } from "../table-no-data"
import { UserTableRow } from "../user-table-row"
import { UserTableHead } from "../user-table-head"
import { TableEmptyRows } from "../table-empty-rows"
import { UserTableToolbar } from "../user-table-toolbar"
import { emptyRows, applyFilter, getComparator } from "../utils"



// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable()
  const [users , setUsers] = useState([])

  const [filterName, setFilterName] = useState("")
  useEffect( ()=>{
    const getUser =async()=>{
      const token = Cookies.get("access")
      try {
        const response = await Users(token);
        if (response.status === 200) {
          setUsers(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUser();
  },[])
  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName
  })
  const notFound = !dataFiltered.length && !!filterName
console.log(dataFiltered)
  return (
    <DashboardContent>
      {users.length?
      <>
      <Box display="flex" alignItems="center" mb={5}>
      <Typography variant="h4" flexGrow={1}>
        کاربران
      </Typography>
      <Button
        variant="contained"
        color="inherit"
        endIcon={<Iconify icon="mingcute:add-line" />}
      >
        کاربر جدید
      </Button>
    </Box>

    <Card>
      <UserTableToolbar
        numSelected={table.selected.length}
        filterName={filterName}
        onFilterName={event => {
          setFilterName(event.target.value)
          table.onResetPage()
        }}
      />

      <Scrollbar>
        <TableContainer sx={{ overflow: "unset" }}>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={users.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={checked =>
                table.onSelectAllRows(
                  checked,
                  users.map(user => user.id)
                )
              }
              headLabel={[
                { id: "id", label: "ID" },
                { id: "first_name", label: "نام" },
                { id: "last_name", label: "نام خانوادگی" },
                { id: "username", label: "نام کاربری" },
                { id: "role", label: "نقش" },
                // { id: "is_active", label: "Verified", align: "center" },
                { id: "" }
              ]}
            />
            <TableBody>
              {users.slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map(row => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(
                  table.page,
                  table.rowsPerPage,
                  users.length
                )}
              />

              {notFound && <TableNoData searchQuery={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        component="div"
        page={table.page}
        count={users.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        labelRowsPerPage="ردیف در هر صفحه"
      />
    </Card>
      </>
      :<Typography variant="body1" color="initial">یوزری پیدا نشد</Typography>
    }
    </DashboardContent>
  )
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0)
  const [orderBy, setOrderBy] = useState("name")
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selected, setSelected] = useState([])
  const [order, setOrder] = useState("asc")

  const onSort = useCallback(
    id => {
      const isAsc = orderBy === id && order === "asc"
      setOrder(isAsc ? "desc" : "asc")
      setOrderBy(id)
    },
    [order, orderBy]
  )

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }, [])

  const onSelectRow = useCallback(
    inputValue => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter(value => value !== inputValue)
        : [...selected, inputValue]

      setSelected(newSelected)
    },
    [selected]
  )

  const onResetPage = useCallback(() => {
    setPage(0)
  }, [])

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage)
  }, [])

  const onChangeRowsPerPage = useCallback(
    event => {
      setRowsPerPage(parseInt(event.target.value, 10))
      onResetPage()
    },
    [onResetPage]
  )

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage
  }
}
