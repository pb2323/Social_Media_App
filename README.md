# Network-In: Social Media Platform for freelancers
<p align="center">
<img src="https://user-images.githubusercontent.com/60563310/188317177-dcd19177-458e-4580-9bbe-8602bb368378.jpeg"/>
</p>

# Website

https://network-in-25db1b54cfae.herokuapp.com/

# What is this?
A social media platform for freelancers where:

* Users will be able to post pictures, status, like, and comment on pictures.

* Users can follow/follow back/unfollow other users to see the content they post. IPFS is used to store the content users post.

* Users can send text messages in real-time, perform audio/video calls.

* Receive notifications of activities in their profile.

* Create a smart contract where the client has to stake freelancer’s fees and the freelancer has to stake half of the amount client staked, which will be stored in the smart contract, until the project is done, as a guarantee from both the parties. Funds can also be transferred partly/fully, the freelancer can add a request for transfer (disabled for client) which has to be approved by the client(disabled for freelancer) for transfer of the assets.

* In addition to this, if there is a conflict between the client and the freelancer, and none of them agrees to a settlement, the client can nominate a guarantor, based on their mutual discussion, who has the ability for both, creating a request as well as approving it, who can decide the final conclusion for the conflict.

* Supporting two major blockchains currently: a) Ethereum b) Polygon

# Tech Stack

The whole project is created using Javascript language. Particularly for the backend, NodeJS + Express framework is used and for the frontend, NextJS is used. MongoDB is used as a database. SocketIO is used for real-time messaging and WebRTC for video/audio call purposes. Solidity language is used to create smart contracts on the Ethereum Blockchain.

# Future Work

* Gas optimizations to reduce the gas fee that users have to pay to interact with the blockchain.

* Client rating feature through which clients can better identify reliable freelancers. 

* We can shift the centralized chatting system to a decentralized network.

* We can use our contract feature in a Saas model and can integrate it to existing centralized platform/competitors and charge them for every contract created or a percentage or ether staked.

# Presentation

https://docs.google.com/presentation/d/1ADW5qzt_3H7majuTGdy31IFyhwUGgNjuL7Qmsmpzdk4/edit?usp=sharing
