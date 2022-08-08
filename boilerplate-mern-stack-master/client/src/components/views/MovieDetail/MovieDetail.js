import React, { useEffect, useState } from 'react'
import {API_KEY, API_URL, IMAGE_BASE_URL} from '../../Config'
import MainImage from '../LandingPage/Sections/MainImage'
import MovieInfo from './Sections/MovieInfo'
import GridCards from '../commons/GridCards'
import Favorite from './Sections/Favorite'
import { Row } from 'antd'


function MovieDetail(props) {

  let movieId = props.match.params.movieId // movieId를 가져옴
  const [Movie, setMovie] = useState([])
  const [Casts, setCasts] = useState([]) // array로 받는다는 뜻
  const [ActorToggle, setActorToggle] = useState(false)
  const [LoadingForCasts, setLoadingForCasts] = useState(true)
  

  //useEffect() : 페이지에 들어오면 무슨 일을 할 건지, 렌더링 될 때 특정 작업을 실행할 수 있게
  useEffect(() => {

    // cast정보만 가져올것(crew엔 감독도 있기 때문)
    let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}` // 영화 출연진 정보 가져옴
    let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`


    //console.log(props.match)
    fetch(endpointInfo)
    .then(response => response.json())
    .then(response =>{
      //console.log(response)
      setMovie(response)

    })

    fetch(endpointCrew)
    .then(response => response.json())
    .then(response =>{
      //console.log('responseForCrew', response)
      setCasts(response.cast)
    })

    setLoadingForCasts(false)
  } , [])

  const toggleActorView = () => {
    setActorToggle(!ActorToggle)
  }

  return (
    <div>
      {/*header*/}
      <MainImage 
        image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`} 
        title={Movie.original_title}
        text={Movie.overview}
      />

      {/*Body*/}
      <div style={ {width:'85%', margin: '1rem auto'} }>

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')}  />
        </div>

        {/*Movie Info*/}
        <MovieInfo 
          movie={Movie}
        />


        <br />
        {/*Actors Grid*/}
        <div style={ {display:'flex', justifyContent:'center', margin:'2rem'} }>
          <button onClick={toggleActorView}>Toggle Actor View</button>
        </div>

        {ActorToggle &&
          <Row gutter={[16, 16]}>
            {!LoadingForCasts ? Casts.map((cast, index) => (
              cast.profile_path &&
              //<React.Fragment key={index}>
                <GridCards 
                  image={cast.profile_path ? `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                  characterName={cast.name}
                  />
              //</React.Fragment>
            )):
          
            <div>loading...</div>
            }
          </Row>
        }


      </div>
    </div>
  )
}

export default MovieDetail
