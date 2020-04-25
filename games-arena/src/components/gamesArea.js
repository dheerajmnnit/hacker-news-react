import React from 'react';
import axios from 'axios';
import GameCard from './gamesCard.js';

class GameArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gamesList: [],
            masterList: [],
        }
    }

    getFilterOptions(list) {
        let platforms = [], genres = [], names = [];
        list.map((game) => {
            let genre = game.genre.split(',');
            genre.map(gameGenre => {
                if (gameGenre && genres.indexOf(gameGenre) === -1) {
                    genres.push(gameGenre);
                }
            });
            if (platforms.indexOf(game.platform) === -1) {
                platforms.push(game.platform);
            }
            if (names.indexOf(game.title) === -1) {
                names.push(game.title);
            }
        });
        this.options = { platforms, genres, names };
        this.props.onDropDownOptions(this.options);
    }

    getFilterData(list) {
        if (this.props.filterData) {
            console.log(this.props.filterData)
        }
        return list;
    }

    componentDidMount() {
        const options = {
            headers: { 
                'X-Requested-With': 'value', 
                'access-control-allow-headers' : 'Origin', 
                'access-control-allow-origin': '*' ,
                'server': 'cloudflare-nginx'
            }
        };
        axios.get('http://starlord.hackerearth.com/gamesext', options)
            .then(response => {
                let list = response.data.slice(0, 99);
                console.log(list);
                list.shift();
                this.getFilterOptions(list);
                this.setState({
                    gamesList: list,
                    masterList: list
                });
            });
    }

    componentDidUpdate(previousprops) {
        let gameList = this.state.masterList;
        let platform = this.props.filterData.platform;
        let oldPlatform = previousprops.filterData.platform;
        let genre = this.props.filterData.genre;
        let gameName = this.props.filterData.search;
        let scoreSort = this.props.filterData.score;
        let newList = gameList;
        if ((platform && oldPlatform !== platform) || (genre && previousprops.filterData.genre !== genre) || (gameName && gameName !== previousprops.filterData.search) || (scoreSort && scoreSort !== previousprops.filterData.score)) {
            if (platform && platform !== 'None')
                newList = gameList.filter(game => game.platform === platform);
            if (genre && genre !== 'None')
                newList = newList.filter(game => game.genre.indexOf(genre) > -1);
            if (gameName && gameName.trim()) {
                newList = newList.filter(game => {
                    if (gameName === game.title || game.title.indexOf(gameName) > -1) {
                        return true;
                    }
                });
            }
            if (scoreSort) {
                if (scoreSort === 'asc') {
                    newList = newList.sort((a, b) => {
                        return a.score - b.score;
                    })
                } else {
                    newList = newList.sort((a, b) => {
                        return b.score - a.score;
                    })
                }
            }
            this.setState({
                gamesList: newList
            });
        }
    }

    render() {
        return (
            <div>

                {this.state.gamesList.length ? <div> {this.state.gamesList.map((game) => <GameCard gameInfo={game} />)} </div> : <div> No records found </div>}
            </div>
        );
    }
}

export default GameArea;