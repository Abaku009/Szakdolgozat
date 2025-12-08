import MainPage from "../components/MainPage/MainPage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import Music from "../components/Music/Music";
import Films from "../components/Films/Films";
import Series from "../components/Series/Series";
import Cart from "../components/Cart/Cart";
import OrderCart from "../components/Cart/OrderCart";
import ReservationCart from "../components/Cart/ReservationCart";
import Contacts from "../components/Contacts/Contacts";
import Registration from "../components/Login_Registration/Registration";
import Login from "../components/Login_Registration/Login";
import Profil from "../components/Profil/Profil";

const routes = [
    {
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/zenek",
        element: <Music />,
    },
    {
        path: "/filmek",
        element: <Films />,
    },
    {
        path: "/sorozatok",
        element: <Series />,
    },
    {
        path: "/kosar",
        element: <Cart />,
    },
    {
        path: "/kosar/order-cart",
        element: <OrderCart />,
    },
    {
        path: "/kosar/reservation-cart",
        element: <ReservationCart />,
    },
    {
        path: "/kapcsolat",
        element: <Contacts />,
    },
    {
        path: "/regisztracio",
        element: <Registration />,
    },
    {
        path: "/bejelentkezes",
        element: <Login />,
    },
    {
        path: "/profil",
        element: <Profil />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
];

export default routes;

