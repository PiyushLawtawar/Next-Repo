/*include ../MixinMolecules/mixin-molecules.pug

-
	var share = {
		aHref: '#',
		aClass: 'a-product__socialShareLabel',
		anchorAttributes : {
			"data-toggle": "modal",
			"data-target": "#social-modal"
		},
		iconClass: 'icon-shared',
		spanText: 'Compartir'
	}

.row
	.col-12
		.m-product__socialShare
			+molecule-anchor-icon-span(share)*/
//import './ProductSocialShare.styl'
import {AnchorIconSpan} from '../../molecules/MixinMolecules/MixinMolecules'
import { parentContext } from '../../../contexts/parentContext';
export default (props) => {
    return (
<div className="row">
                      <div className="col-12">
                        <div className="m-product__socialShare">
							<parentContext.Consumer>
								{({ OpenModal }) => (
                              		<AnchorIconSpan onClick={() => OpenModal('showModal10')} Linkclass="a-product__socialShareLabel" href="#" data-toggle="modal" data-target="#social-modal" iconClass="icon-shared" spanText="Compartir" />
								)}
            				</parentContext.Consumer>
                        </div>
                      </div>
                    </div>


    );
}