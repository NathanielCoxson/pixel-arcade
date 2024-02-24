import one from './minesweeper-one.svg';
import two from './minesweeper-two.svg';
import three from './minesweeper-three.svg';
import four from './minesweeper-four.svg';
import five from './minesweeper-five.svg';
import six from './minesweeper-six.svg';
import seven from './minesweeper-seven.svg';
import eight from './minesweeper-eight.svg';
import covered from './minesweeper-covered.svg';
import mine from './minesweeper-mine.svg';
import empty from './minesweeper-empty.svg';
import flag from './minesweeper-flag.svg';
import unknown from './minesweeper-unknown.svg';
import gameOver from './game_over.svg';
import gameWon from './game_won.svg';
import leaderboard_icon from './leaderboard_icon.svg';

export const images = {
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    empty,
    covered,
    unknown,
    flag,
    mine,
    gameOver,
    gameWon,
    leaderboard_icon,
}

export function getImageSrc(value: number): typeof one {
    if (value === -1) return mine;
    const numerical = [empty, one, two, three, four, five, six, seven, eight];
    return numerical[value];
} 