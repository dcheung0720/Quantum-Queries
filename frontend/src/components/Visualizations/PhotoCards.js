import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'

const PhotoCards = ({images})=>{
    console.log(images);
    return (
        <Carousel>
            {
                images.map((image, i) => <img src={image} width={500}/>)
            }
        </Carousel>
    )

};


export default PhotoCards;