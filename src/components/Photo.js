import React, { useEffect, useState } from "react";
import { Image } from 'primereact/image';
import { ProgressSpinner } from 'primereact/progressspinner';
import "./Photo.css";
import { Button } from 'primereact/button';
import { capitalize} from '../helpers/string-transform-helper';
import axios from 'axios';

function Photo(props) {  
	console.log('Photo Rendered');
	const [imageData, setImageData] = useState(null);


	useEffect(() => {
		console.log('Use Effect in Photo was called')
		loadRandomImage();
		return () => {};
	}, []);

	useEffect(() => {
		if (!props) {
			return;
		}

		if(props.breed && props.subBreed) {
			console.log('subBreed: ' + props.suBreed);
			loadFilteredImage(props.breed.breedName, props.subBreed);
		}
		else if(props.breed) {
			console.log('breed: ' + props.breed);
			loadFilteredImage(props.breed.breedName);
		}
		else {
			loadRandomImage();
		}
	}, [props.breed, props.subBreed]);

	const loadRandomImage = () => {
		axios.get("/random").then((res) => {
			console.log('random', res);
			setImageData(res.data);
		})
	};
	
	const loadFilteredImage = (breed, subBreed = null) => {
		console.log('breed', breed);
		axios.get("/breed/param", {
			params: {
			  breed: breed,
			  ...(subBreed ? { subBread: subBreed } : {})
			},
		  }).then((res)=> {
			  setImageData(res.data);
			  console.log('imageData', imageData);
		  })
		//const res = await fetch(`/breed/param?breed=${breed}`);
	};

	const saveFavoriteDog = (dogName) => {
		// Load favorite dogs array from local storage
		var favoriteDogs = JSON.parse(window.localStorage.getItem("favorite_dogs"));

		// If the array doesn't exist, create it
		if (!favoriteDogs) {
			favoriteDogs = [];
		}

		// Add the new dog to the array
		favoriteDogs.push(dogName);

		// Save the dog to the local store
		window.localStorage.setItem("favorite_dogs", JSON.stringify(favoriteDogs));
	};

	const isFavoriteDog = (dogName) => {
		// Load favorite dogs array from local storage
		var favoriteDogs = JSON.parse(window.localStorage.getItem("favorite_dogs"));

		// If the array doesn't exist, then the dog is not favorite
		if (!favoriteDogs) {
			return false;
		}

		return favoriteDogs.includes(dogName);
	};

	// @todo add subfilter 
	const nextHandler = async (breed) => {
		if (breed && breed.breedName && breed.subBreed) {
			loadFilteredImage(breed.breedName, breed.subBreed);
		}
		else if(breed && breed.breedName) {
			loadFilteredImage(breed.breedName);
		}
		else {
			loadRandomImage();
		}
	}

	const likeHandler = async (breed) => {
		saveFavoriteDog(imageData.imageName);

		if (breed && breed.breedName) {
			loadFilteredImage(breed.breedName);
		}
		else {
			loadRandomImage();
		}
	}

    return (
        <div>{imageData ?
        (
        <React.Fragment>
			<h3> Breed: {imageData?.breed ? capitalize(imageData.breed) : ''}</h3>
            <Image src={imageData.message} alt="Image" width="250" />
			<Button label="Next" onClick={ () => nextHandler(props.breed) }/>
			{ isFavoriteDog(imageData.imageName) ?
			(
				<Button label="❤ Favorite" disabled={true} />
			)
			:
			(
				<Button label="Like" onClick={ () => likeHandler(props.breed)}/>
			)
			}
        </React.Fragment>
        )
		:
		(
		<React.Fragment>
			<ProgressSpinner/>
		</React.Fragment>
		)
        }</div>
    )

}

export default Photo