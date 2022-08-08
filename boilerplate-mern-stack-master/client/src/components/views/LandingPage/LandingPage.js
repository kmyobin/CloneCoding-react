import React, {useEffect, useState} from 'react'
import {API_URL, API_KEY, IMAGE_BASE_URL} from '../../Config';
import MainImage from './Sections/MainImage';
import GridCards from '../commons/GridCards';
import { Row } from 'antd';

function LandingPage() {

    const [Movies, setMovies] = useState([])
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [CurrentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        // page 업데이트하면서 20개씩 받아옴
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`; // page 1(landingpage이므로)
        fetchMovies(endpoint)
    }, [])

    const fetchMovies = (endpoint)=>{
        fetch(endpoint) // 인기있는 영화 가져오기
        .then(response => response.json()) // 결괏값 가져오기
        .then(response =>{
            // setMovies에서 가져온 영화 정보를 덮어쓰기 때문에 업데이트가 안됨
            // 있던 것에 추가하려면 setMovies([...Movies, ...response.results])
            setMovies([...Movies, ...response.results]) // = setMovies(...[response.results])
            setMainMovieImage(response.results[0])
            setCurrentPage(response.page)
        } )
    }

    const loadMoreItems = () => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`; // page 2
    
        fetchMovies(endpoint)
    }


    return (
       <div style={{width:'100%', margin: '0'}}>

        {/*Main Image*/}
        {MainMovieImage && 
            <MainImage 
                image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`} 
                title={MainMovieImage.original_title}
                text={MainMovieImage.overview}
            />
        
        } 
        

        <div style={{width:'85%', margin: '1rem auto'}}>

            <h2>Movies by latest</h2>
            <hr />

            {/*Movie Grid Cards*/}

            <Row gutter={[16, 16]}>

                {Movies && Movies.map((movie, index) => (
                    <React.Fragment key={index}>
                        <GridCards 
                            landingPage
                            image={movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : null}
                            movieId={movie.id} // 고유의 영화 정보에 들어가기 위해 필요
                            movieName={movie.original_title}
                            
                        />
                    </React.Fragment>
                ))}
            </Row>
        </div>

        <div style={{display:'flex', justifyContent: 'center'}}>
            <button onClick={loadMoreItems}>Load More</button>
        </div>

       </div>
    )
}

export default LandingPage
