import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'normalize.css/normalize.css';

class App extends Component {
    render() {
        const { children } = this.props;
        return (
            <main>
                {children}
            </main>
        );
    }
}

App.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
