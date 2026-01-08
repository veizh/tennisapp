import { NavLink } from "react-router-dom";
export const NavBar = () => {
  return (
    <div className="navBar">
      <h1>
        BE<span>T</span>ENNIS{" "}
      </h1>
      <div className="link">
        <NavLink to="/simulation">Faire une simulation</NavLink>
        <NavLink to="/">Index</NavLink>
      </div>
    </div>
  );
};
