import { H2 } from "../../atoms/HeadLines/Headlines";
import Link from "../../atoms/Link/Link";

export default (props) => {
  const { texto = '', icon=false, classe } = props;
  
return (
  //  <div className="m-box-title d-none d-lg-block">
  <div className="m-box-title d-block d-lg-none">
                            <div className="d-flex justify-content-start align-items-center">
                                          <H2 headLineClass={classe} headLineText={props.headLineText || texto}/>
                            </div>
                          </div>
);
}