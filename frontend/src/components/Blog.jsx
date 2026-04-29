import React from "react";

export default function Main(){
return(
<div>
  <div className="container">
<p style={{ fontFamily: "Verdana, sans-serif" }} >date:21 may 2022</p>
<h2 style={{ fontFamily: "Helvetica, sans-serif" }}>How to include a file in your c++ project<br/><h4>hear is a complete guide for you</h4></h2>
<p>
Whenever we want to create a c++ project we can make our life easy by using 
external libraries developed by experrienced devs all areound world.
</p>
<h4 style={{ fontFamily: "Helvetica, sans-serif" }}>Famous c++ libraries:-</h4>
<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Used for</th>
      <th scope="col">Documentation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Crow</td>
      <td>used for making servers and <br/>socket programming</td>
      <td><a href="https://github.com/ipkn/crow">@Link</a></td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Nlohmann/json</td>
      <td>used for treating json as an<br/>inbuilt data type</td>
      <td><a href="https://github.com/nlohmann/json">@nlohmann/json</a></td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>DumaisLib</td>
      <td>used for creating c++ rest api<br/>and Websockets</td>
      <td><a href="https://github.com/pdumais/DumaisLib">@DumaisLib</a></td>
    </tr>
  </tbody>
</table>
</div>
</div>
)
}