import React, { useState, useEffect } from 'react'

import { Loader, Card, FormField } from '../components'

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />)
  }
// ejemplo   data= [post1={_id=1}, post2={_id=2, imag:dfsdsdfg,}, post3]

/*
el componente  RenderCards  agarra el arreglo "data" y a cada elemento dentro del arreglo (post es un objeto) le 
fabrica un componente <Card/ key={post._id} {...post}> 
 RenderCards retorna un arreglo de <Cards/> 
*/

/* ejemplo de post
const post = {
  title: "Beautiful Landscape",
  description: "An AI-generated image of a landscape",
  author: "John Doe",
};*/

/* ejem,plo de CArd
<Card 
  title="Beautiful Landscape" 
  description="An AI-generated image of a landscape" 
  author="John Doe" 
/>
*/


  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  )
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch('https://dall-e-t4la.onrender.com/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if(response.ok) {
          const result = await response.json();

          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);

    setSearchText(e.target.value);

    setSearchTimeout(
    setTimeout(() => {
      const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));

      setSearchedResults(searchResult);
    }, 500)
  );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1
          className="font-extrabold text-[#222328] text-
        [32px]"
        >
          La Vitrina de la Comunidad
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w [500px]">
        Navega a través de una colección de imágenes visualmente impresionantes generadas por Hugging Face AI
        </p>
      </div>

      <div className="mt-16">
        <FormField 
          LabeLName="Buscar publicaciones"
          type="text"
          name="text"
          placeholder="Buscar publicaciones"
          value={searchText}
          handLeChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Mostrando resultados sobre{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No se han encontrado resultados de búsqueda"
                />
              ) : (
                <RenderCards 
                  data={allPosts} 
                  title="No se han encontrado publicaciones" 
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
