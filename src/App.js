import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, Icon, Dropdown } from 'semantic-ui-react'


function App() {
  const [ghostposts, setGhostposts] = useState();
  const [formInput, setFormInput] = useState("");
  const [boastOrRoast, setBoastOrRoast] = useState(false);
  const [filter, setFilter] = useState("n")
  const [sort, setSort] = useState('-datetime')


  useEffect(() => {
    getPosts()
  }, [filter, sort])

  const sortOptions = [
    {
      key: 'newest',
      text: 'Newest',
      value: 'newest',
    },
    {
      key: 'oldest',
      text: 'Oldest',
      value: 'Oldest',
    },
    {
      key: 'top',
      text: 'Top Rated',
      value: 'top',
    },
    {
      key: 'bottom',
      text: 'Bottom Rated',
      value: 'bottom',
    },
  ]

  const getPosts = () => {
    fetch(`http://localhost:8000/ghostposts/?brn=${filter}&sort-by=${sort}`)
    .then(response => response.json())
    .then(data => setGhostposts(data.results))
  }

  const handleFormInput = (event) => {
    event.preventDefault()
    setFormInput(event.target.value)
  }

  const handleBoastOrRoast = (event) => {
    if(event.target.value==="boast"){
      setBoastOrRoast(true)
    }
    if(event.target.value==="roast"){
      setBoastOrRoast(false)
    }
  }

  const handleFilterAndSort = (event) =>{
    let switchWord
    if(event.target.value){
      switchWord = event.target.value
    }
    else{
      switchWord = event.target.children[0].innerHTML
    }
    switch(switchWord){
      case "viewAllPosts": 
        setFilter("n")
        break;
      case "justBoasts":
        setFilter("b")
        break;
      case "justRoasts":
        setFilter("r")
        break;
      case "Newest":
        setSort("-datetime")
        break;
      case "Oldest":
        setSort("datetime")
        break;
      case "Top Rated":
        setSort("score")
        break;
      case "Bottom Rated":
        setSort("-score")
        break;
      default:
    }
  }

  const submitGhostPost = (event) => {
    event.preventDefault()
    const requestBody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          "boast": boastOrRoast,
          "text": formInput,
          "upvotes": 0,
          "downvotes": 0,
          "private_url": "123456"
      })
    }
    fetch('http://localhost:8000/ghostposts/',requestBody)
    .then(response => response.json())
    getPosts()
  }

  const submitUpvote = (id) => {
    fetch(`http://localhost:8000/ghostposts/${id}/upvote/`, {method: 'POST'})
    getPosts()
  }

  const submitDownvote = (id) => {
    fetch(`http://localhost:8000/ghostposts/${id}/downvote/`, {method: 'POST'})
    getPosts()
  }

  return (
    <div className="App">
      <header className="App-header">
        GhostPost
      </header>
      <Card centered>
        <h2>
          Create a GhostPost
        </h2>
        <div className="submit-ghostpost">
          <form onSubmit={event => submitGhostPost(event)}>
            <input
              name="boastOrRoast"
              type="radio"
              id="boast"
              value="boast"
              checked={boastOrRoast}
              onChange={e => handleBoastOrRoast(e)}
            />
            <label for="boast">Boast </label>
            <input
              name="boastOrRoast"
              type="radio"
              id="roast"
              value="roast"
              checked={!boastOrRoast}
              onChange={e => handleBoastOrRoast(e)}
            />
            <label for="roast">Roast</label>
            <br />
            <input 
              name="ghostPostText"
              value={formInput || ""}
              onChange={(e) => handleFormInput(e)}
            />
            <input 
              type="submit"
              value="Post, Ghost!"
            />
          </form>
        </div> 
      </Card>
      <Card className="filter-and-sort">
        <form>
          <input 
            name="viewAllPosts"
            type="radio"
            value="viewAllPosts"
            onChange={(e) => handleFilterAndSort(e)}
            checked={filter === "n"}
          />
          <label for="viewAllPosts">All Posts</label>
          <input 
            name="justBoasts"
            type="radio"
            value="justBoasts"
            onChange={(e) => handleFilterAndSort(e)}
            checked={filter === "b"}
          />
          <label for="justBoasts">Just Boasts</label>
          <input 
            name="justRoasts"
            type="radio"
            value="justRoasts"
            onChange={(e) => handleFilterAndSort(e)}
            checked={filter === "r"}
          />
          <label for="justRoasts">Just Roasts</label>
          <Dropdown
            placeholder='Sort by...'
            fluid
            selection
            options={sortOptions}
            onChange={handleFilterAndSort}
            value={sort}
          />
        </form>
      </Card>
        {ghostposts && 
        <Card.Group centered>
        {ghostposts.map(post => {
          return (
            <Card key={post.pk} color={post.boast ? "green" : "orange"} >
              <Card.Content>
                <Card.Header>
                  {post.text}
                </Card.Header>
                <Card.Description>
                  {post.boast ? "Boast" : "Roast"}
                </Card.Description>
                <Card.Meta>
                  {new Date(post.datetime).toString().slice(0, 25)}
                </Card.Meta>
                <Card.Content extra>
                  <Icon 
                    name="arrow alternate circle up"
                    onClick={(event) => submitUpvote(post.pk)}
                  />
                  <Icon 
                    name="arrow alternate circle down"
                    onClick={(event) => submitDownvote(post.pk)}
                  /> 
                  {post.upvotes - post.downvotes}
                </Card.Content>
              </Card.Content>
            </Card>
          )
        
        })}
        </Card.Group>}
      
    </div>
  );
}

export default App;
