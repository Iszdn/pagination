import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';

function App() {

  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPageData] = useState(4)
  const [inpValue, setInpValue] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" })


  function datalar() {
    fetch("https://northwind.vercel.app/api/categories").then(res => res.json()).then(items => setData(items))
  }
  useEffect(() => {
    datalar()
  }, [])

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortData = useMemo(() => {
    let sortableDatas = [...data]
    if (sortConfig.key) {
      sortableDatas.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'descending' ? 1 : -1;
        }
        return 0;
      })
    }
    return sortableDatas
  }, [data, sortConfig])

  const filteredData =sortData.filter(item => item.name.toLocaleLowerCase().includes(inpValue.toLocaleLowerCase()) || item.description.toLocaleLowerCase().includes(inpValue.toLocaleLowerCase()))


  const PageNumbers = []
  for (let i = 1; i <= Math.ceil(filteredData.length / perPageData); i++) {
    PageNumbers.push(i)
  }


  const lastElementIndex = perPageData * currentPage
  const firstElementIndex = lastElementIndex - perPageData
  const PageDatas = filteredData.slice(firstElementIndex, lastElementIndex)


  return (
    <>
      <input type="search" value={inpValue} onChange={(e) => { setInpValue(e.target.value.toLocaleLowerCase()) }} />
      <table >
        <thead>
          <tr >
            <th onClick={() => requestSort("id")}>Id</th>
            <th onClick={() => requestSort("name")}>Name</th>
            <th onClick={() => requestSort("description")}>Description</th>
          </tr>
        </thead>
        <tbody>

          {PageDatas && PageDatas

            .map((item =>
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
              </tr>
            ))}

        </tbody>
      </table>
      <div>
        {
          PageNumbers.map(page => (
            <button key={page} onClick={() => setCurrentPage(page)}>{page}</button>
          ))
        }
      </div>
    </>
  );
}

export default App;
