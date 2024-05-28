import {useForm} from "react-hook-form";
import './charSearchForm.scss';
import useMarvelService from "../../services/MarvelService";
import {Link} from "react-router-dom";
import {useState} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { error, clearError, getCharacterByName, loading } = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const onSubmit = async (data) => {
        const { name } = data;
        clearError();
        try {
            const character = await getCharacterByName(name);
            onCharLoaded(character);
        } catch (error) {
            console.error("Error occurred while fetching character:", error);
        }
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const results = !char ? null : char.length > 0 ?
        <div className="char__search-wrapper">
            <div className="char__search-success">There is! Visit {char[0].name} page?</div>
            <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                <div className="inner">To page</div>
            </Link>
        </div> :
        <div className="char__search-error">
            The character was not found. Check the name and try again
        </div>;

    return (
        <div className="char__search-form">
        <form onSubmit={handleSubmit(onSubmit)}>
            <label  className="char__search-label" htmlFor="name">Character Name:</label>
            <div className="char__search-wrapper">
                <input {...register('name', {required: true})}
                       type="text"
                       name='name'
                       placeholder='Enter a name'
                style={errors.name ? {border: '1px solid red'} : null}/>
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className="button button__main">
                    <div className="inner">{isSubmitting ? 'Loading...' : 'Find'}</div>
                </button>
            </div>
        </form>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;