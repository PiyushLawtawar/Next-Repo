/* Changes for defects 22957, 23425, 23423 and 22974  START */
//Import the basic functionality from React
import React, {Component} from 'react';

//Import the molecules needed for this component
import InputSelect from '../../molecules/InputSelect/InputSelect';

class LiverpoolDatePicker extends Component {
    constructor(props) {
        super(props);
        //Create the state for the Date Picker Component
        this.state = {
            preloaded: false,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            selectedYear: '',
            selectedMonth: '',
            selectedDay: '',
            selectedMonthString: ''
        };
    }

    /**
     * Function that checks if a selected date is valid for the year and month selected. Takes into account leap years and months with 30 days.
     * For invalid dates, this function does set the days dropdown to the closest valid date.
     * 
     */
    /* Changes for defects 23872 START */
    checkForValidDate() {
        let selectedDay = this.state.selectedDay;
        let selectedMonth = this.state.selectedMonth;
        let selectedYear = this.state.selectedYear;
        let isLeap;

        //Not exceed the 30 days in a 30 days month
        if (selectedMonth === 4 || selectedMonth === 6 || selectedMonth === 9 || selectedMonth === 11) {
            if (selectedDay > 30) {
                this.setState({ selectedDay: 30 });
            }
        }

        //Not exceed the 28 days in February and check for leap years to let 29 days
        if (selectedMonth === 2) {
            if (selectedDay >= 29) {
                if (selectedYear % 400 === 0) {
                    isLeap = true;
                }
                else if (selectedYear % 100 === 0) {
                    isLeap = false;
                }
                else if (selectedYear % 4 === 0) {
                    isLeap = true;
                }
                else {
                    isLeap = false;
                }

                if (isLeap && selectedDay >= 30) {
                    this.setState({ selectedDay: 29 });
                }

                if (!isLeap && selectedDay >= 29) {
                    this.setState({ selectedDay: 28 });
                }
            }
        }

        //Not exceed the current date in the future
        // bug 24044 future date should be selectable for cart GR search
        if (this.props.case=="bag"?false:((selectedMonth === this.state.month || selectedMonth > this.state.month) && selectedYear >= this.state.year)) {
            let monthStringToSet;

            switch(this.state.month) {
                case 1:
                    monthStringToSet = 'Ene';
                    break;
                case 2:
                    monthStringToSet = 'Feb';
                    break;
                case 3:
                    monthStringToSet = 'Mar';
                    break;
                case 4:
                    monthStringToSet = 'Abr';
                    break;
                case 5: 
                    monthStringToSet = 'May';
                    break;
                case 6:
                    monthStringToSet = 'Jun';
                    break;
                case 7:
                    monthStringToSet = 'Jul';
                    break;
                case 8: 
                    monthStringToSet = 'Ago';
                    break;
                case 9:
                    monthStringToSet = 'Sep';
                    break;
                case 10: 
                    monthStringToSet = 'Oct';
                    break;
                case 11:
                    monthStringToSet = 'Nov';
                    break;
                case 12: 
                    monthStringToSet = 'Dic';
                    break;
                default:
                    monthStringToSet = '';
            }

            this.setState({ 
                selectedDay: this.state.day,
                selectedMonth: this.state.month,
                selectedMonthString: monthStringToSet
             });
        }
    }
    /* Changes for defects 23872 END */

    generateDays() {
        let numberOfDays = [];
        let arrayDays = [{id: '', value: ''}];
        let i = 0;

        for(i = 1; i <= 31; i++) {
            numberOfDays.push(i);
        }

        numberOfDays.map((day) => {
            arrayDays.push({
                id: day.toString(),
                value: day.toString()
            });
        });

        return arrayDays;
    }

    generateMonths() {
        let months = [{
            id: '',
            value: ''
        },
        {
            id: '1',
            value: 'Ene'
        },
        {
            id: '2',
            value: 'Feb'
        },
        {
            id: '3',
            value: 'Mar'
        },
        {
            id: '4',
            value: 'Abr'
        },
        {
            id: '5',
            value: 'May'
        },
        {
            id: '6',
            value: 'Jun'
        },
        {
            id: '7',
            value: 'Jul'
        },
        {
            id: '8',
            value: 'Ago'
        },
        {
            id: '9',
            value: 'Sep'
        },
        {
            id: '10',
            value: 'Oct'
        },
        {
            id: '11',
            value: 'Nov'
        },
        {
            id: '12',
            value: 'Dic'
        }];

        return months;
    }

    generateYears() {
       
        let years = [{id: '', value: ''}];
        let currentYear = this.state.year;
        let i;
        if(this.props.case=="bag"){
            currentYear = currentYear + 1
            for(i = 0; i < 2; i++){
            years.push({
                id: i + 1,
                value: currentYear--
            });
        }
        }
        else{
            for(i = 0; i < 100; i++){
                    years.push({
                        id: i + 1,
                        value: currentYear--
                    });
                }
        } 
        return years;
    }

    /* Changes for defects 22957, 23906 and 22979 START */
    changeDayHandler(e){
        let day = e.target.value;
        let dayToSet;

        if(day === '') {
            dayToSet = day;
        }
        else {
            dayToSet = parseInt(day);
        }

        this.setState({ selectedDay: dayToSet }, () => {
            this.checkForValidDate();
        });
    }
    /* Changes for defects 22957, 23906 and 22979 END */

    changeMonthHandler(e){
        let monthString = e.target.value;
        
        let month;

        switch(monthString) {
            case 'Ene':
                month = 1;
                break;
            case 'Feb':
                month = 2;
                break;
            case 'Mar':
                month = 3;
                break;
            case 'Abr':
                month = 4;
                break;
            case 'May':
                month = 5;
                break;
            case 'Jun':
                month = 6;
                break;
            case 'Jul':
                month = 7;
                break;
            case 'Ago':
                month = 8;
                break;
            case 'Sep':
                month = 9;
                break;
            case 'Oct':
                month = 10;
                break;
            case 'Nov':
                month = 11;
                break;
            case 'Dic':
                month = 12;
                break;
            default:
                month = '';
        }

        this.setState({ 
            selectedMonth: month,
            selectedMonthString: monthString 
        }, () => {
            this.checkForValidDate();
        });
    }

    /* Changes for defects 22957, 23906 and 22979 START */
    changeYearHandler(e) {
        let year = e.target.value;
        let yearToSet;

        if(year === '') {
            yearToSet = '';
        }
        else {
            yearToSet = parseInt(year);
        }

        this.setState({ selectedYear: yearToSet }, () => {
            this.checkForValidDate();
        });
    }
    /* Changes for defects 22957, 23906 and 22979 END */

    shouldComponentUpdate(nextProps, nextState){
        let resp = true;
        if(this.state.selectedDay === nextState.selectedDay && this.state.selectedMonth === nextState.selectedMonth && this.state.selectedYear === nextState.selectedYear){
            resp = false;
        }

        return resp;
    }

    /* Changes for defects 22957, 23906 and 22979 START */
    componentDidUpdate() {
        let day = this.state.selectedDay;
        let month = this.state.selectedMonth;
        let year = this.state.selectedYear;

        if(day === '' || month === '' || year === '') {
            this.props.passDate('');
        }
        else {
            if(day < 10){
                day = '0' + day;
            }

            if(month < 10){
                month = '0' + month;
            }

            let completeDate = month + '/' + day + '/' + year;
            completeDate = new Date(completeDate);

            this.props.passDate(completeDate);
        }
    }
    /* Changes for defects 22957, 23906 and 22979 END */

    /* Changes for defects 22957, 23906 and 22979 START */
    componentWillReceiveProps(nextProps, nextContent){
        if(nextProps.predefinedDate !== '' && !this.state.preloaded && nextProps.case === 'update') {
            let dayToSet = nextProps.predefinedDate.getDate();
            let monthToSet = nextProps.predefinedDate.getMonth() + 1;
            let yearToSet = nextProps.predefinedDate.getFullYear();
            let monthStringToSet;

            monthToSet = parseInt(monthToSet);

            switch(monthToSet) {
                case 1:
                    monthStringToSet = 'Ene';
                    break;
                case 2:
                    monthStringToSet = 'Feb';
                    break;
                case 3:
                    monthStringToSet = 'Mar';
                    break;
                case 4:
                    monthStringToSet = 'Abr';
                    break;
                case 5: 
                    monthStringToSet = 'May';
                    break;
                case 6:
                    monthStringToSet = 'Jun';
                    break;
                case 7:
                    monthStringToSet = 'Jul';
                    break;
                case 8: 
                    monthStringToSet = 'Ago';
                    break;
                case 9:
                    monthStringToSet = 'Sep';
                    break;
                case 10: 
                    monthStringToSet = 'Oct';
                    break;
                case 11:
                    monthStringToSet = 'Nov';
                    break;
                case 12: 
                    monthStringToSet = 'Dic';
                    break;
                default:
                    monthStringToSet = '';
            }

            this.setState({
                selectedDay: parseInt(dayToSet),
                selectedMonth: monthToSet,
                selectedMonthString: monthStringToSet,
                selectedYear: parseInt(yearToSet),
                preloaded: true
            });
        }
    }
    /* Changes for defects 22957, 23906 and 22979 END */

    render () {
        let dayArray = this.generateDays();
        let monthsArray = this.generateMonths();
        let yearsArray = this.generateYears();
        let creationMessage;

        let dayOptions = {
            labelText: "Día",
            labelId: 'daySelectorLabel',
            helperText: 'Selecciona un día',
            optionList: dayArray,
            required: true,
            selected: false
        };

        let monthOptions = {
            labelText: "Mes",
            labelId: "monthSelectorLabel",
            helperText: "Selecciona un mes",
            optionList: monthsArray,
            required: true,
            selected: false
        };

        let yearOptions = {
            labelText: "Año",
            labelId: "yearSelectorLabel",
            helperText: "Selecciona un año",
            optionList: yearsArray,
            required: true,
            selected: false
        };

        if(this.props.case == 'create'){
            creationMessage = (
                <div class="row">
                    <div class="col-lg-12 col-12">
                        <div class="a-dateAlert mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent">
                            Selecciona tu fecha de nacimiento
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className={this.props.case=="confirmation"?"row m-wrapDate mt-3 mt-lg-0 dob-order":this.props.case=="bag"?'row m-wrapDate':'row m-wrapDate mt-3'} >
                    <div className="col-4 firstDatePicker">
                        <InputSelect
                            options={dayOptions}
                            name="daySelector"
                            value={this.state.selectedDay}
                            handleChange={(e) => this.changeDayHandler(e)}
                            error_message="Introduce un día"
                            required
                            datePicker={this.props.case=="bag"?'true':''}
                        />
                    </div>
                    <div className="col-4 middleDatePicker">
                        <InputSelect
                            options={monthOptions}
                            name="monthSelector"
                            value={this.state.selectedMonthString}
                            handleChange={(e) => this.changeMonthHandler(e)}
                            error_message="Introduce un mes"
                            required
                            datePicker={this.props.case=="bag"?'true':''}
                        />
                    </div>
                    <div className="col-4 lastDatePicker">
                        <InputSelect
                            options={yearOptions}
                            name="yearSelector"
                            value={this.state.selectedYear}
                            handleChange={(e) => this.changeYearHandler(e)}
                            error_message="Introduce un año"
                            required
                            datePicker={this.props.case=="bag"?'true':''}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default LiverpoolDatePicker;
/* Changes for defects 22957, 23425, 23423 and 22974  END */
