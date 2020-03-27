/*include ../../molecules/Accordion/molecule-accordion.pug

.o-product__comment
	+molecule-accordion("nav-item","Opiniones del artículo","labelclassNamename","target2","object2","","","","icon-arrow_down","nav-link","comment")(aria-expanded="true")*/


import Accordion from '../../molecules/Accordion/Accordion';
import React from 'react';




class PdpProductComment extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col mx-3 my-4 d-flex align-items-center">
            <p className="m-0">Este artículo no tiene cuenta con opiniones todavía
                                                            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-2 mx-3 mb-5">
            <button className="a-btn a-btn--tertiary">Escribe una opinión

                                                            </button>
          </div>
        </div>
      </React.Fragment>






    );
  }
}
export default PdpProductComment;