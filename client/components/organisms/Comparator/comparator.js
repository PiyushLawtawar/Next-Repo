import Paragraph from "../../atoms/Paragraph/Paragraph";
import  MaterialInputCheckBox from "../../molecules/MaterialInputCheckBox/MaterialInputCheckBox";
//import './organism-comparator.styl';
export default (props) => {
    const staticLabels = props.staticLabels || {};
    let tableDetails = props.tableDetails || [];
    if(props.showOnlyDifferences)
    tableDetails = tableDetails.filter(obj=>obj.differences);
     const diffClass = (props.showOnlyDifferences)? 'difference' : '';
    return(
        <div className="o-comparator">
            <div className="row m-title__comparator">
                <div className="col-9">
                    <Paragraph className="a-paragraph__compareTitle">{staticLabels['pwaComparePage-attributes-table-title'] || 'pwaComparePage-attributes-table-title'}</Paragraph>
                </div>
                <div className="col-3 pr-0 text-right">
                    <MaterialInputCheckBox onChange={props.handleShowOnlyDiff} checked={props.showOnlyDifferences} text={staticLabels['pwaComparePage-checkBox-showDifferences-label'] || 'pwaComparePage-checkBox-showDifferences-label'} id='handleShowOnlyDiff' />
                </div>
            </div>
            <div className="row m-table__comparator">
                <table className="table">
                    <tbody>
                        {tableDetails.map((obj,key)=>{
                            return(
                                <tr key={obj.name}>
                                    <th scope="row">{obj.name}</th>
                                    {
                                        obj.td.map((value,index)=>{
                                            if(value){
                                                return <td key={obj.name+''+index} className={diffClass}>{value}</td>
                                            }else{
                                                return <td key={obj.name+''+index} className={diffClass+" td-line"}> - </td>
                                            }
                                        })
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}