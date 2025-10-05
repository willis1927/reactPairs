
import './App.css';
import { useState } from 'react';
import { createClient } from 'pexels';
import { Image } from 'primereact/image';
        

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
  const [category, setCategory] = useState("fruits");
  const [turnCounter, setTurnCounter] = useState(0);
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
    }, 500);
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
  setTurnCounter(0);
  const query = String(category);
  client.photos
    .search({ query, per_page: cardQty, orientation: 'square' })
    .then(photos => {
      

      let cards = [];
      for (let i = 0; i < cardQty; i++) {
        const img = photos.photos[i];
        const cardA = {
          id: `${i}A`,
          paired: false,
          visible: false,
          link: img ? img.src.medium : "",
          alt: img ? img.alt : "",
          owner: img ? img.photographer : "",
          value: i
        };
        cards.push(cardA);

        const cardB = {
          id: `${i}B`,
          paired: false,
          visible: false,
          link: img ? img.src.medium : "",
          alt: img ? img.alt : "",
          owner: img ? img.photographer : "",
          value: i
        };
        cards.push(cardB);
      }

      cards.sort(() => Math.random() - 0.5);
      setGameData({
        cards: cards,
        state: 'playing'
      });
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
      setTurnCounter(turnCounter + 1);
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
      <div className="flex flex-col items-center space-y-4 mt-4">
      <h1 className="text-4xl font-bold text-center m-4">React Card Match Game</h1>
      <span><label htmlFor="cardQty" className="text-lg font-medium">Number of Card Pairs (1-25): </label> 

      <input type="number" id="cardQty" className="border border-gray-300 rounded-lg" onChange={(e)=>setCardQty(e.target.value)} min={1} max={25} value={cardQty}></input>
      </span>
      <span><label  htmlFor="categorySelect" className="text-lg font-medium"> Select a category: </label><select className="border border-gray-300 rounded-lg p-2 m-4" id="categorySelect" value={category} onChange={(e)=>setCategory(e.target.value)}>
        {categories.map((cat, idx)=>{
          return(
            <option key={idx} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          )
        })}
      </select>
      
      </span>
      <span className="text-lg font-medium">Turns: {turnCounter} </span>
      <button className="bg-purple-500 text-white font-bold rounded-lg p-2 m-4" onClick={handleStartGame}>Create New Game</button>
      </div>
      <div className="Container grid grid-cols-2 md:grid-cols-10 gap-4 justify-center items-center p-4">
      {gamedata.cards.map((card)=>{
        return(
          <div key={card.id} id={card.id} className="Card border border-gray-300 aspect-square rounded-lg m-4 shadow-2xl shadow-blue-900" onClick={() =>handleCardClick(card.id)}>
            {card.visible ? (
              <div className="relative w-full h-full">
    <Image
      src={card.link}
      alt={card.alt}
      className="block mx-auto w-full h-full object-fill rounded-lg border-2 border-white"
    />
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-[10px] px-2 rounded-b-lg text-center">
      {card.owner}
    </div>
  </div>
            ): (
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex aspect-square items-center justify-center rounded-lg shadow-lg"></div >
      )}
            
          </div>
        )
      })}
      </div>
  

  


  <a href="https://www.pexels.com" target='_blank' rel="noreferrer" className="mt-8">
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
