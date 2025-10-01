import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { createClient } from 'pexels';


function App() {
  const client = createClient('J3rAGK7qyASIeivXCUAhHby1qILUQWHyEcxUJgA9FIIzJWv8QkLMEUKW');
  

  // State to hold game data
  const [gamedata, setGameData] = useState({
    cards : [],
    state : 'new' // new, playing, finished
  })
  // State to hold the number of card pairs
  const [cardQty, setCardQty] = useState(1);
  const [firstCardIdx, setFirstCardIdx] = useState(null)
  const categories = ["animals", "sports", "flags", "fruits", "vehicles", "faces", "foods", "nature", "objects", "symbols"];
  const [category, setCategory] = useState("flags");
  const [src, setSrc] = useState(null);
  // Function to check for a match between two cards
const checkForMatch = (firstIdx, secondIdx) => {
  if (gamedata.cards[firstIdx].value === gamedata.cards[secondIdx].value) {
    // It's a match
    let cards = [...gamedata.cards];
    cards[firstIdx].paired = true;
    cards[secondIdx].paired = true;
    setGameData({
      cards: cards,
      state: gamedata.state
    });
  } else {
    // Not a match, hide the cards after a short delay
    setTimeout(() => {
      let cards = [...gamedata.cards];
      cards[firstIdx].visible = false;
      cards[secondIdx].visible = false;
      setGameData({
        cards: cards,
        state: gamedata.state
      });
    }, 1000);
  }
  setFirstCardIdx(null); // Reset first card index for the next turn
  setTimeout(() => {if (gamedata.cards.every(card => card.paired)) {
    setGameData(prevData => ({
      ...prevData,
      state: 'finished'
    }));
    alert("Congratulations! You've matched all the cards!");
  }
},250);
}


  // Function to handle starting a new game
  const handleStartGame = () => {
  if (gamedata.state !== 'new') {
    const confirmed = window.confirm("Start a new game?");
    if (!confirmed) return;
  }
  createGame();
};

  // Function to create a new game
  const createGame = () => {
    const query = toString(category);
    console.log(query);
    // Fetch a random image from Pexels based on the selected category
    client.photos
    .search({ query, per_page: 1 })
    .then(photos => {setSrc(photos.photos[0].src.original);
      console.log(src);
    });
    let cards = [];
    for(let i=0; i<cardQty; i++){
      const cardA = {
        id: `${i}A`,
        paired: false,
        visible: false,
        link: `https://cdn.countryflags.com/thumbs/wales/flag-round-250.png`,
        value: i
      }
      
      cards.push(cardA);
      
      const cardb = {
        id: `${i}B`,
        paired: false,
        visible: false,
        link: `https://cdn.countryflags.com/thumbs/wales/flag-round-250.png`,
        value: i
        
      }
      
      cards.push(cardb);
    }
    
  
    cards.sort(() => Math.random() - 0.5);
    setGameData({
      cards: cards,
      state: 'playing'
    });
    
  }

   
  // Function to handle card click
  const handleCardClick = (id) => {
  
    //Find the index of the clicked card
    const currentCardIdx = gamedata.cards.findIndex((c)=> c.id === id);

    if (gamedata.cards[currentCardIdx].paired || gamedata.cards[currentCardIdx].visible) 
      return; // Ignore clicks on already paired or visible cards
    
    
    if(firstCardIdx === null){
      
      setFirstCardIdx(currentCardIdx)
    } else { 
      const secondCardIdx = currentCardIdx;
      checkForMatch(firstCardIdx, secondCardIdx)
    }
    
    
   

    //Toggle the visibility of the card
    let cards = [...gamedata.cards];
    cards[currentCardIdx].visible = cards[currentCardIdx].visible? false : true;
    //Update the state
    setGameData({
      cards: cards,
      state: gamedata.state
    });
  }
  
  return (
    <div className="App">
      <h1 className="text-4xl font-bold text-center m-4">React Card Match Game</h1>
      <label htmlFor="cardQty" className="text-lg font-medium">Number of Card Pairs (1-25): </label> 

      <input type="number" id="cardQty" className="border border-gray-300 rounded-lg p-2 m-4" onChange={(e)=>setCardQty(e.target.value)} min={1} max={25} value={cardQty}></input>
      <button className="bg-purple-500 text-white font-bold rounded-lg p-2 m-4" onClick={handleStartGame}>Create New Game</button>
      <select className="border border-gray-300 rounded-lg p-2 m-4" value={category} onChange={(e)=>setCategory(e.target.value)}>
        {categories.map((cat, idx)=>{
          return(
            <option key={idx} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          )
        })}
      </select>
      <div className="Container grid grid-cols-2 md:grid-cols-10 gap-4 justify-center items-center p-4">
      {gamedata.cards.map((card)=>{
        return(
          <div key={card.id} id={card.id} className="Card border border-gray-300 aspect-square rounded-lg m-4 shadow-2xl shadow-blue-900" onClick={() =>handleCardClick(card.id)}>
            {card.visible ? <img src="#" /*</div>{card.link}*/ alt={card.id} className="w-[90%] h-[90%] object-contain mx-auto my-auto block"></img>: 
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex aspect-square items-center justify-center rounded-lg shadow-lg"></div >}
            
          </div>
        )
      })}
      </div>
  

  <img src={src} alt="Random from Pexels" className="block mx-auto my-8 w-64 h-64 object-contain"/>


  <a href="https://www.pexels.com">
  <img
    src="https://images.pexels.com/lib/api/pexels.png"
    className="block mx-auto w-24 h-24 object-contain"
    alt="Pexels logo"
  />
</a>
<p>Photos provided by Pexels</p>

    </div>
  );
}

export default App;
