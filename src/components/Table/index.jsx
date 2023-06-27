import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { Table, IconButton, Pagination } from "rsuite";
import { confirm } from "@rsuite/interactions";
import { v4 } from "uuid";
import PencilIcon from "@rsuite/icons/legacy/Pencil";
import HistoryIcon from "@rsuite/icons/legacy/History";
import MoveDownIcon from "@rsuite/icons/MoveDown";
import FilePdfIcon from "@rsuite/icons/legacy/FilePdfO";
import TrashIcon from "@rsuite/icons/legacy/Trash";
import { get, del, API_URL } from "../../helpers/axiosClient";
import { useMount, useUpdateEffect } from "react-use";
import { useHistory } from "react-router-dom";
import { FeatureFlag } from "../FeatureFlag";
import useStore from "../../helpers/store";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const { Column, HeaderCell, Cell } = Table;
let interval;

export const CustomTable = forwardRef((props, ref) => {
  const {
    columns,
    showActions,
    endpoint,
    redirectUrl,
    formatData,
    featureFlags,
    showToolbar,
    toolbarOptions,
    showSearch,
  } = props;
  const history = useHistory();
  const [sortColumn, setSortColumn] = React.useState();
  const [sortType, setSortType] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [textSearch, setTextSearch] = React.useState("");
  const [data, setData] = React.useState([]);
  const [count, setCount] = React.useState();
  const { empresaSeleccionada } = useStore();

  const onDelete = async (rowData) => {
    try {
      await del(`${endpoint}/${rowData.id}`);
      toast.success("Registro borrado exitosamente!");
      return fetchData();
    } catch (error) {
      toast.error("Error al borrar registro");
    }
  };

  const onRestore = async (rowData) => {
    try {
      await get(`shared/db-restore/${rowData.id}`);
      toast.success("Base de datos restaurada exitosamente!");
    } catch (error) {
      toast.error("Error al restaurar la base de datos");
    } finally {
      setTimeout(() => {
        return fetchData();
      }, 3000)
    }
  };

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell
        {...props}
        style={{
          padding: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {redirectUrl && (
          <FeatureFlag label={featureFlags?.editar}>
            <IconButton
              appearance="subtle"
              icon={<PencilIcon />}
              onClick={() => history.push(`${redirectUrl}/${rowData.id}`)}
            />
          </FeatureFlag>
        )}

        {redirectUrl && (
          <FeatureFlag label={featureFlags?.historial}>
            <IconButton
              appearance="subtle"
              icon={<HistoryIcon />}
              onClick={() =>
                history.push(`${redirectUrl}/history/${rowData.id}`)
              }
            />
          </FeatureFlag>
        )}

        {toolbarOptions?.restore && (
          <div>
            <IconButton
              appearance="subtle"
              icon={<MoveDownIcon />}
              onClick={() => onRestore(rowData)}
            />
          </div>
        )}

        <div className={toolbarOptions?.report ? "d-block" : "d-none"}>
          <IconButton
            appearance="subtle"
            icon={<FilePdfIcon />}
            href={`${API_URL}${endpoint}/generate-report/${rowData.id}`}
            target="_blank"
          />
        </div>

        <FeatureFlag label={featureFlags?.borrar}>
          <IconButton
            appearance="subtle"
            icon={<TrashIcon />}
            onClick={() =>
              confirm("Estas seguro de borrar el registro?", {
                okButtonText: "Si",
                cancelButtonText: "Cancelar",
                onOk: () => onDelete(rowData),
              })
            }
          />
        </FeatureFlag>
      </Cell>
    );
  };

  useMount(async () => {
    await fetchData();
  });

  const fetchData = async () => {
    let extraParams = {};
    if (empresaSeleccionada) extraParams = { empresa: empresaSeleccionada };
    const { data, count } = await get(endpoint, {
      params: {
        skip: page,
        take: limit,
        text: textSearch,
        ...extraParams,
      },
    });
    setCount(count);
    if (formatData && typeof formatData === "function") {
      const sortedData = sortData(data);
      setData(formatData(sortedData));
      return;
    }
    const sortedData = sortData(data);
    setData(sortedData);
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchData,
  }));

  useEffect(() => {
    fetchData();
  }, [page, limit, textSearch]);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const sortData = useCallback(
    (data) => {
      if (sortColumn && sortType) {
        return data.sort((a, b) => {
          let x = a[sortColumn];
          let y = b[sortColumn];
          if (typeof x === "string") {
            x = x.charCodeAt();
          }
          if (typeof y === "string") {
            y = y.charCodeAt();
          }
          if (sortType === "asc") {
            return x - y;
          } else {
            return y - x;
          }
        });
      }
      return data;
    },
    [sortColumn, sortType]
  );

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(async () => {
      setSortColumn(sortColumn);
      setSortType(sortType);
      await fetchData();
      setLoading(false);
    }, 500);
  };

  const onSearch = (event) => {
    setTimeout(() => {
      clearTimeout(interval);
      setTextSearch(event.target.value);
    }, 800);
  };

  return (
    <div>
      {showToolbar ? (
        <div
          style={{
            marginBottom: 5,
            display: "flex",
            justifyContent: showSearch ? "space-between" : "flex-end",
            alignItems: "center",
          }}
        >
          {showSearch && (
            <div className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar..."
                  onChange={onSearch}
                />
                <span className="bx bx-search-alt" />
              </div>
            </div>
          )}
          <div>
            <button className="btn btn-light" onClick={() => fetchData()}>
              <i className="bx bx-refresh bx-spin font-size-16 align-middle me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      ) : null}
      <Table
        height={300}
        data={data}
        autoHeight
        affixHeader
        id="table"
        bordered
        cellBordered
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
      >
        {(columns || []).map((column) => {
          return (
            <Column
              width={100}
              key={v4()}
              align="center"
              // resizable
              flexGrow={1}
              sortable
            >
              <HeaderCell>{column.name}</HeaderCell>
              <Cell>{(rowData) => rowData[column.field]}</Cell>
            </Column>
          );
        })}
        {showActions && (
          <Column width={200} align="center">
            <HeaderCell>Actions</HeaderCell>
            <ActionCell dataKey="id" />
          </Column>
        )}
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={count}
          limitOptions={[10, 15]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
});

CustomTable.defaultProps = {
  showToolbar: true,
  showSearch: true,
};
