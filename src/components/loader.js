import { SpinnerInfinity } from 'spinners-react';
import './styles/Loader.css';

export const Loader =() => {
    return (
        <div className="loader">
            <SpinnerInfinity size={150} thickness={150} speed={100} color="rgb(9, 86, 187)" secondaryColor="rgba(0, 0, 0, 0)" />
        </div>
    )
}