import Header from "../components/Header";
import MenuBar from "../components/MenuBar";

const Home = () => {
    return (
        <div className="d-flex flex-column aling-items-center justify-content-center min-vh-100">
            <MenuBar/>
            <Header />
        </div>
    )
}

export default Home;