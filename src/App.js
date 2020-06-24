import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, Icon } from 'semantic-ui-react'


function App() {
  const [ghostposts, setGhostposts] = useState();
  const [formInput, setFormInput] = useState("");
  const [boastOrRoast, setBoastOrRoast] = useState(false);


  useEffect(() => {
    getPosts()
  }, [])

  const getPosts = () => {
    fetch('http://localhost:8000/ghostposts')
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
        <div>
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
        {ghostposts && 
        <Card.Group centered>
        {ghostposts.map(post => {
          return (
            <Card key={post.pk}>
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
