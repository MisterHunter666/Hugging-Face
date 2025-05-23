import React, { useState } from 'react';
import { Loader, Card, FormField } from '../components';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (search = '', pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${REACT_APP_DALLE_FETCH_ROUTE}/api/v1/post?search=${encodeURIComponent(search)}&page=${pageNum}&limit=8`
      );
      const result = await response.json();
      if (response.ok) {
        setPosts(result.data);
        setTotalPages(result.totalPages);
        setPage(result.currentPage);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && searchText.trim() !== '') {
      await fetchPosts(searchText, 1);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPosts(searchText, newPage);
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          La Vitrina de la Comunidad
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w [500px]">
          Navega a través de una colección de imágenes visualmente impresionantes generadas por Hugging Face AI
        </p>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Buscar publicaciones"
          type="text"
          name="text"
          placeholder="Buscar publicaciones, presiona enter"
          value={searchText}
          handLeChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {posts.length > 0 && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Mostrando resultados sobre{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              <RenderCards
                data={posts}
                title="No se han encontrado publicaciones"
              />
            </div>

            {}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded ${
                      page === i + 1
                        ? 'bg-[#6449ff] text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
