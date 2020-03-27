import isEmpty from 'lodash/isEmpty';

export default class dashboardData {

    widthChange = (mq) => {
        return mq.matches ? 'web' : 'mobile';
    }
    
    getData(orderSuccess, windowInstance) {
        try {
            const mq = windowInstance.matchMedia('(min-width: 768px)');
            mq.addListener(this.widthChange);
    
            let objClone = { ...orderSuccess, canal: this.widthChange(mq) };
            var process = {};
            process.env = JSON.parse(document.getElementById('envVar').value);
            //console.log('PROCESS ENV', process.env);
            
            // fetch('https://us-central1-fechaestimadaentregaprod.cloudfunctions.net/pwaQA',{
            fetch(process.env.EDD_DA,{
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify(objClone),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => { /*console.log('Dashboard Success', process.env.EDD_DA, data)*/ })
            .catch(err => console.error(err));

        } catch(err) {
            console.error("ERROR TO DASHBOARD", err);
        }
    }

    getDataCustomProduct(orderSuccess, windowInstance, skus) {
        try {
            let customProducts = JSON.parse(localStorage.getItem('customProduct'));

            if (!isEmpty(customProducts) && customProducts.length > 0 && skus.length > 0) {
                let result = [];
                customProducts.forEach(e1=>skus.forEach(e2=> {
                    if (e1.sku === e2.sku) {
                        result.push({
                            text: e1.text,
                            font: e1.font,
                            size: e1.size,
                            color: e1.color,
                            sku: e1.sku
                        });
                    }
                }));
    
                if (result.length > 0) {
    
                    const mq = windowInstance.matchMedia('(min-width: 768px)');
                    mq.addListener(this.widthChange);
    
                    let newObjectAll = { ...orderSuccess, result, canal: this.widthChange(mq) };
    
                    fetch("https://us-central1-productospersonalizados-edea9.cloudfunctions.net/customProductsPWA",{
                        mode: 'cors',
                        method: 'POST',
                        body: JSON.stringify(newObjectAll),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => { 
                        localStorage.removeItem('customProduct');
                        console.log('CustomProduct', data) 
                    })
                    .catch(err => console.log(err));
                }
            }
        } catch(err) {
            console.log("ERROR SENDING DATA CUSTOM PRODUCTS", err);
        }
    }
}
