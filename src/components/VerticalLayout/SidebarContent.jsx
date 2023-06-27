import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import { FeatureFlag } from "../FeatureFlag";
import { AdminWrapper } from "../AdminWrapper";

const SidebarContent = (props) => {
  const ref = useRef();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{props.t("Menu")} </li>
                        <li>
                            <Link to="/#" className="">
                                <i className="bx bx-home-circle"></i>
                                <span className="badge rounded-pill bg-info float-end">
                                    04
                                </span>
                                <span>{props.t("Dashboards")}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/contacts-profile">
                                <i className="bx bxs-user-detail"></i>
                                <span>{props.t("Profile")}</span>
                            </Link>
                        </li> */}

            <li>
              <FeatureFlag label="Modulo clientes">
                <Link to="/#" className="has-arrow ">
                  <i className="bx bxs-business"></i>
                  <span>Clientes</span>
                </Link>
              </FeatureFlag>
              <ul className="sub-menu" aria-expanded="false">
                <FeatureFlag label="Crear clientes">
                  <li>
                    <Link to="/clients/create">Nuevo cliente</Link>
                  </li>
                </FeatureFlag>
                <li>
                  <Link to="/clients">Lista de clientes</Link>
                </li>
              </ul>
            </li>

            <li>
              <FeatureFlag label="Modulo comprobantes">
                <Link to="/#" className="has-arrow ">
                  {/* <i className="bx bx-file"></i> */}
                  <i className="fas fa-book"></i>
                  <span>Comprobantes de diario</span>
                </Link>
              </FeatureFlag>
              <ul className="sub-menu" aria-expanded="false">
                <FeatureFlag label="Crear comprobantes">
                  <li>
                    <Link to="/journal-vouchers/create">Nuevo comprobante</Link>
                  </li>
                </FeatureFlag>
                <FeatureFlag label="Visualizar clientes">
                  <li>
                    <Link to="/journal-vouchers">Lista de comprobantes</Link>
                  </li>
                </FeatureFlag>
              </ul>
            </li>

            <li>
              <FeatureFlag label="Modulo facturas">
                <Link to="/#" className="has-arrow ">
                  {/* <i className="bx bx-file"></i> */}
                  <i className="fas fa-file-invoice"></i>
                  <span>Facturas</span>
                </Link>
              </FeatureFlag>
              <ul className="sub-menu" aria-expanded="false">
                <FeatureFlag label="Crear facturas">
                  <li>
                    <Link to="/bills/create">Nueva factura</Link>
                  </li>
                </FeatureFlag>
                <li>
                  <Link to="/bills">Lista de facturas</Link>
                </li>
              </ul>
            </li>

            <AdminWrapper>
              <li>
                <Link to="/#" className="has-arrow ">
                  <i className="bx bxs-user"></i>
                  <span>Usuarios</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to="/users/create">Nuevo usuario</Link>
                  </li>
                  <li>
                    <Link to="/users">Lista de usuarios</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/backups">
                  <i className="bx bxs-data"></i>
                  <span>Respaldo BD</span>
                </Link>
              </li>

              <li>
                <Link to="/features-flags">
                  <i className="bx bxs-lock-open-alt"></i>
                  <span>Funciones (Permisos)</span>
                </Link>
              </li>
            </AdminWrapper>
            <li>
              <Link to="/help">
                <i className="bx bx-help-circle"></i>
                <span>Ayuda</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
