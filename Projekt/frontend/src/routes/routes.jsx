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
import MainReservation from "../components/Reservations/MainReservation";
import OnSiteReservation from "../components/Reservations/OnSiteReservation";
import OnlineReservation from "../components/Reservations/OnlineReservation";
import OwnReservations from "../components/OwnReservations/OwnReservations";
import AdminReservations from "../components/Admin/AdminReservations/AdminReservations";
import AdminProfiles from "../components/Admin/AdminProfiles/AdminProfiles";
import AdminMusic from "../components/Admin/AdminMusic/AdminMusic";
import AdminFilms from "../components/Admin/AdminFilms/AdminFilms";
import AdminSeries from "../components/Admin/AdminSeries/AdminSeries";


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
        path: "/foglalas",
        element: <MainReservation />,
    },
    {
        path: "/foglalas/helybenFoglalas",
        element: <OnSiteReservation />,
    },
    {
        path: "/foglalas/onlineFoglalas",
        element: <OnlineReservation />,
    },
    {
        path: "/sajatFoglalasok",
        element: <OwnReservations />,
    },
    {
        path: "/admin_foglalasok",
        element: <AdminReservations />,
    },
    {
        path: "/admin_profilok",
        element: <AdminProfiles />,
    },
    {
        path: "/admin_zenek",
        element: <AdminMusic />,
    },
    {
        path: "/admin_filmek",
        element: <AdminFilms />,
    },
    {
        path: "/admin_sorozatok",
        element: <AdminSeries />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
];

export default routes;

