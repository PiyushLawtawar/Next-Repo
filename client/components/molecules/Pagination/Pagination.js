import React from 'react';
import PropTypes from 'prop-types';
import Button from "../../atoms/Button/Button";
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
//import './Pagination.styl'

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentDidMount() {
        if (this.props.totalRecords && this.props.totalRecords > 0) {
            let { totalRecords, recordsPerPage, currentPage } = this.props;
            let pager = this.state.pager;

            if (currentPage < 1 || currentPage > pager.totalPages) {
                return;
            }
            pager = this.getPager(totalRecords, currentPage, recordsPerPage);

            this.setState({ pager: pager });

        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentPage !== nextProps.currentPage) {
            let { totalRecords, recordsPerPage } = this.props;
            if (totalRecords && totalRecords > 0) {                
                let { currentPage } = nextProps;
                let pager = this.state.pager;

                if (currentPage < 1 || currentPage > pager.totalPages) {
                    return;
                }
                pager = this.getPager(totalRecords, currentPage, recordsPerPage);

                this.setState({ pager: pager });
            }
        }
    }

    componentDidUpdate(prevProps) {
        // reset page if totalRecords array has changed        
        if (this.props.totalRecords !== prevProps.totalRecords) {
            const { currentPage } = this.props;
            const page = currentPage;
            let { totalRecords, recordsPerPage } = this.props;
            let pager = this.state.pager;            
            pager = this.getPager(totalRecords, page, recordsPerPage);
            this.setState({ pager: pager });
            if (page < 1 || page > pager.totalPages) {
                return;
            }
    
        }
    }

    setPage(page) {
        let { totalRecords, recordsPerPage } = this.props;
        let pager = this.state.pager;
        pager = this.getPager(totalRecords, page, recordsPerPage);
        this.setState({ pager: pager });
        if (page < 1 || page > pager.totalPages) {
            return;
        }        
        this.props.onChangePage(pager);
    }

    getPager(totalRecords, currentPage, recordsPerPage) {
        let totalPages = Math.ceil(totalRecords / recordsPerPage);

        let startPage, endPage;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        let startIndex = (currentPage - 1) * recordsPerPage;
        let endIndex = Math.min(startIndex + recordsPerPage - 1, totalRecords - 1);

        let pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        return {
            totalRecords: totalRecords,
            currentPage: currentPage,
            recordsPerPage: recordsPerPage,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }


    render() {        
        let pager = this.state.pager;
        if (!pager.pages || pager.pages.length <= 1) {
            return null;
        }
        return (
            <div className="col-12 o-content no-shadow -pagination">

                <nav className="d-none d-lg-block" aria-label="Pagination">
                    <ul className="pagination justify-content-md-center justify-content-lg-end m-pagination">
                        <li key="First" className={pager.currentPage === 1 ? 'page-item d-none' : 'page-item'}>
                            <a className="page-link" onClick={() => this.setPage(1)}><i className="icon-first_page"></i></a>
                        </li>
                        <li key="Previous" className={pager.currentPage === 1 ? 'page-item d-none' : 'page-item'}>
                            <a className="page-link" onClick={() => this.setPage(pager.currentPage - 1)}><i className="icon-arrow_left"></i></a>
                        </li>
                        {
                            !isEmpty(pager.pages) && map(pager.pages, (page, index) => {
                                return <li key={index} className={pager.currentPage === page ? 'page-item active' : 'page-item'}>
                                    <a className="page-link" onClick={() => this.setPage(page)}>{page}</a>
                                </li>
                            })
                        }
                        <li key="Next" className={pager.currentPage === pager.totalPages ? 'page-item d-none' : 'page-item'}>
                            <a className="page-link" onClick={() => this.setPage(pager.currentPage + 1)}><i className="icon-arrow_right"></i></a>
                        </li>
                        <li key="Last" className={pager.currentPage === pager.totalPages ? 'page-item d-none' : 'page-item'}>
                            <a className="page-link" onClick={() => this.setPage(pager.totalPages)}><i className="icon-next"></i></a>
                        </li>
                    </ul>
                </nav>
                <div className="row d-flex d-lg-none">
                    <div className="col-6 pl-2 pr-1">
                        <Button disabled={pager.currentPage <= 1 ? true: false} handleClick={() => this.setPage(pager.currentPage - 1)} className={pager.currentPage === 1 ? 'a-btn__pagination disabled' : 'a-btn__pagination -before'} ripple="ripple" >
                        Anterior <i className="icon-arrow_left"></i> 
                        </Button>
                    </div>
                    <div className="col-6 pr-2 pl-1">
                        <Button disabled={pager.currentPage === pager.totalPages ? true: false} handleClick={() => this.setPage(pager.currentPage + 1)} className={pager.currentPage === pager.totalPages ? 'a-btn__pagination disabled': 'a-btn__pagination'} ripple="ripple" >
                            Siguiente <i className="icon-arrow_right"></i>
                        </Button></div>
                </div>
            </div>
        );
    }
}

Pagination.propTypes = {
    totalRecords: PropTypes.number,
    onChangePage: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
    recordsPerPage: PropTypes.number
};

Pagination.defaultProps = {
    currentPage: 1,
    recordsPerPage: 5,
    currentPage: 1
};
export default Pagination;