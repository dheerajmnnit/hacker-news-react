import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import GameArea from './gamesArea.js';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import SortUp from 'material-ui/svg-icons/navigation/arrow-upward';
import SortDown from 'material-ui/svg-icons/navigation/arrow-downward';
import Person from 'material-ui/svg-icons/social/person';

const style = {
    'background-color': '#3a3a3a',
    'text-align': 'left'
};

const buttonStyles = {
    margin: '15px'
}

class GameArena extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            open2: false,
            platforms: [],
            genres: [],
            filterData: {
            },
            names: [],
            sort: false
        };
    }

    onDropDownOptions = (options) => {
        options.platforms.unshift('None');
        options.genres.unshift('None');
        this.setState({
            platforms: options.platforms,
            genres: options.genres,
            names: options.names
        });
    }

    handleClick = (event) => {
        event.preventDefault();
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleClickGenre = (event) => {
        event.preventDefault();
        this.setState({
            open2: true,
            anchorEl2: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
            open2: false
        });
    };

    search = (searchText) => {
        this.filterData({ 'search': searchText });
    };

    filterData = (category) => {
        let filterData = this.state.filterData;
        this.setState({
            filterData: Object.assign({}, filterData, category),
            open: false,
            open2: false
        });
    }

    resetPlatform = () => {
        this.filterData({ platform: 'None' });
    }

    resetGenre = () => {
        this.filterData({ genre: 'None' });
    }

    sortScore = (sort) => {
        this.filterData({ 'score': sort });
        let sortValue = !this.state.sort;
        this.setState({
            sort: sortValue
        })
    }

    render() {
        return (
            <div>
                <AppBar
                    style={style}
                    title='Game arena'>
                    {this.state.sort ? <SortUp onClick={this.sortScore.bind(this, 'desc')} style={{ margin: '20px', fill: 'white' }} /> : <SortDown onClick={this.sortScore.bind(this, 'asc')} style={{ margin: '20px', fill: 'white' }} />}
                    <AutoComplete
                        filter={AutoComplete.caseInsensitiveFilter}
                        dataSource={this.state.names}
                        textFieldStyle={{ color: 'white', 'background-color': 'white', 'border-radius': '10px', 'height': '40px' }}
                        style={{ color: 'white', margin: '12px' }}
                        onUpdateInput={this.search}
                    />
                    <FlatButton
                        style={buttonStyles}
                        backgroundColor="white"
                        hoverColor="white"
                        onClick={this.handleClick}
                        label="Platforms"
                    />
                    <Popover
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        onRequestClose={this.handleRequestClose}
                    >
                        <Menu>
                            {this.state.platforms.map(platform => <MenuItem primaryText={platform} onClick={this.filterData.bind(this, { platform })} />)}
                        </Menu>
                    </Popover>
                    <FlatButton
                        style={buttonStyles}
                        backgroundColor="white"
                        hoverColor="white"
                        onClick={this.handleClickGenre}
                        label="Genres"
                    />
                    <Popover
                        open={this.state.open2}
                        anchorEl={this.state.anchorEl2}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        onRequestClose={this.handleRequestClose}
                    >
                        <Menu>
                            {this.state.genres.map(genre => <MenuItem primaryText={genre} onClick={this.filterData.bind(this, { genre })} />)}
                        </Menu>
                    </Popover>
                    {(this.state.filterData.platform && this.state.filterData.platform !== 'None') ?
                        <Chip style={{ margin: '15px' }} onRequestDelete={this.resetPlatform}>
                            {this.state.filterData.platform}
                        </Chip> : <div></div>}
                    {(this.state.filterData.genre && this.state.filterData.genre !== 'None') ?
                        <Chip style={{ margin: '15px' }} onRequestDelete={this.resetGenre}>
                            {this.state.filterData.genre}
                        </Chip> : <div></div>}
                    <a target="_blank" href="https://www.linkedin.com/in/dheerajprajapati/" rel="noopener noreferrer"><Person style={{ margin: '20px', fill: 'white' }} /></a>
                </AppBar>
                <GameArea onDropDownOptions={this.onDropDownOptions} filterData={this.state.filterData} />
            </div>
        );
    }
}

export default GameArena;