import NavBar from "../../molecules/NavBar/NavBar";
export default ({ className, ...props }) => {
  const { data } = props;
  return (
    <div className="row pt-2 pb-2 align-items-center">
      <div className="col-lg-8 text-left">
        <nav className="o-nav-desktop-menu">
          <ul className="m-desktop-menu-list">
            <li className="show">
              <button className="btn btn-default a-header__strongLink a-nav-desktop-menu-action" data-toggle="dropdown" data-hover="dropdown" aria-expanded="true">Departamentos<i className="icon-arrow_down"></i>
              </button>
            </li>

            <li>
              <button className="btn btn-default a-header__strongLink">Mesa de regalos
                                          </button>
            </li>
            <li>
              <button className="btn btn-default a-header__strongLink popover-session" type="button" data-container="body" data-toggle="popover" data-placement="bottom" data-trigger="hover" data-popover-content="#creditPanel" data-original-title="" title="">Mi crédito<i className="icon-arrow_down"></i>
              </button>
              <div className="d-none" id="creditPanel">
                <div className="popover-body">
                  <div className="m-session__popover">
                    <ul>
                      <li><a className="a-header__sessionLink" href="#" prefetch={false}>Estado de cuenta</a>
                      </li>
                      <li><a className="a-header__sessionLink" href="#" prefetch={false}>Estatus de solicitud</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <button className="btn btn-default a-header__strongLink popover-session" type="button" data-container="body" data-toggle="popover" data-placement="bottom" data-trigger="hover" data-popover-content="#segurosPanel" data-original-title="" title="">Seguros<i className="icon-arrow_down"></i>
              </button>
              <div className="d-none" id="segurosPanel">
                <div className="popover-body">
                  <div className="m-session__popover">
                    <ul>
                      <li><a className="a-header__sessionLink" href="#" prefetch={false}>Seguro de autos</a>
                      </li>
                      <li><a className="a-header__sessionLink" href="#" prefetch={false}>Más información de seguros</a>
                      </li>
                      <li><a className="a-header__sessionLink" href="#" prefetch={false}>Protección celular</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>








      <div className="col-lg-4 text-right">
        <nav className="o-nav-desktop-menu">
          <ul className="m-desktop-menu-list">
            <li>
              <button className="btn btn-default a-header__strongLink">Sorteos
                                          </button>
            </li>
            <li>
              <button className="btn btn-default a-header__strongLink">Ayuda
                                          </button>
            </li>
            <li>
              <button className="btn btn-default a-header__strongLink">Tiendas
                                          </button>
            </li>
          </ul>
        </nav>
      </div>







    </div>


  );
}