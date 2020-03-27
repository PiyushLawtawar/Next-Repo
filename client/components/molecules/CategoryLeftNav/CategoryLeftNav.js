import CategoryLink from '../CategoryLink/CategoryLink'
import CategoryItem from '../CategoryItem/CategoryItem'

//import './CategoryLeftNav.styl';

export default (props) => {
    const { type, classNameItem = "", navUrl, text, categoryName, showPLP } = props;

    return (
        
           
                (type == "firstLevel")?
                <CategoryLink classNameLink="a-category__link-firstLevel" showPLP={showPLP} text={text} navUrl={navUrl}/>
                :
                    (type == "secondLevel")?
                    <CategoryLink classNameLink="a-category__link-secondLevel" showPLP={showPLP} type={type} text={text} navUrl={'#'}/> 
                    : 
                        (type == "subCategory")?
                        <CategoryItem categoryName={categoryName} text={text} showPLP={showPLP} navUrl={navUrl} classItem={classNameItem}>{props.children}</CategoryItem>
                        :
                        null
            
        
    );
}
