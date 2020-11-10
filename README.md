[![SonarCloud][sonar-shield]][sonar-url]

[![CI Pipeline][ci-shield]][ci-url]
[![CD Pipeline][cd-shield]][cd-url]


<!-- INTRODUCTION -->
# Welcome

Money-Tree by Soft-Investors

This project is a Capstone Software Engineering Design Project. It is a project for final year software engineering undergraduates at Concordia University (course codes ENGR 490 & SOEN 490). Students work in teams of 7 to 8 members to construct a significant software application. The class meets at regular intervals. Team members will give a presentation of their contribution to the project.

It consists of 3 major releases with 3 sprints each, where broad requirements are specified in an outline.

</br>

Supervised by Dr. Ali Akgunduz, PhD (ENGR 490) and Dr. Nikolaos Tsantalis, PhD (SOEN 490)

Sponsored By: Royal Bank of Canada (RBC) [Lindsay Bangs]


<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About](#about)
  * [The Project](#about-the-project)
  * [The Repo](#about-the-repo)
  * [The Contributors](#about-the-contributors)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)


<!-- ABOUT -->
## About

A web platform that encourage good investing practices.

:mag:[DEV Environment](http://dev.money-tree.tech)

:rocket:[PROD Environment](http://money-tree.tech)


<!-- ABOUT THE PROJECT -->
### About The Project

Investing in equities is a mysterious and complex concept to many people in the younger generations. This discourages them from investing, leading them with less savings.

Investing usually requires either a broker that communicates with you over the phone, or an online broker. Phone brokers are a slow and expensive process. Online brokers are faster and cheaper, but are complicated to use as they contain a lot of harder concepts and aren’t optimised for inexperienced users

Our solution is to create a platform the younger generation is familiar with and encourage good investing practices.

It will be a web application that will allow users to trade equities in a social manner. Users will be able to follow other users similar to Twitter and see what actions they are doing as well as what equities they are holding. We will also include a leaderboard for an aspect of gamification. Through the use of social media and gamification, we hope to encourage the younger generation to invest and grow their savings. This will allow this generation to have a voice in terms of which company they believe in and want to succeed, an activity usually geared towards older people with a greater financial power.


<!-- ABOUT THE REPO -->
### About The Repo

This is a monorepo that consists of two parts:
- The [Client](/client)
- The [Backend](/backend)


<!-- ABOUT THE CONTRIBUTORS -->
### About The Contributors
* Alessandro Kreslin (Team Leader)
* David-Étienne Pigeon
* Razine Ahmed Bensari
* Walter Fleury
* Seyedhossein Noorbakhsh
* Arthur Tourneyrie
* Abdulrahim Mansour
* Marwan Ayadi


### Built With
* [Docker][docker-url]

Other frameworks that we use are listed under either the [client](/client) part or the [backend](/backend) part.


<!-- GETTING STARTED -->
## Getting Started

Follow these steps to get a working version of our application

### Prerequisites

**Make sure you also have the prerequisites from both the [client](/client) and [backend](/backend) **

* [Docker Engine and Docker Compose](https://docs.docker.com/get-docker/)

### Installation

1. Get a free Alpaca API Key at [https://app.alpaca.markets/signup](https://app.alpaca.markets/signup)
2. Get a free IEX Cloud API Key at [https://iexcloud.io/cloud-login#/register](https://iexcloud.io/cloud-login#/register)
2. Clone the repo
```sh
git clone https://github.com/DPigeon/Money-Tree.git
```
4. Enter your API in `/backend/application.properties`
```XML
alpaca_token='ENTER YOUR API KEY'
iex_token='ENTER YOU API KEY'
```
5. Run the Docker Container (from the root folder of the project)
```sh
docker compose up
```


<!-- USAGE EXAMPLES -->
## Usage
The client is running on port 80,

You can access it with the following link [http://localhost:80/](http://localhost:80/)

Similarly, other services can be accessed:
* The backend is running on port 8080
* Neo4j Database is running on port 7474(bolt) and the browser 7687(http)


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/DPigeon/Money-Tree/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

See [Contributing Guideline](/.github/CONTRIBUTING.md)


<!-- LICENSE -->
## License

See [License](/.github/LICENSE.md)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[sonar-shield]: https://sonarcloud.io/images/project_badges/sonarcloud-black.svg
[sonar-url]: https://sonarcloud.io/organizations/money-tree/projects
[ci-shield]: https://github.com/DPigeon/Money-Tree/workflows/CI%20Pipeline/badge.svg
[ci-url]: https://github.com/DPigeon/Money-Tree/actions
[cd-shield]: https://github.com/DPigeon/Money-Tree/workflows/CD%20Pipeline/badge.svg
[cd-url]: https://github.com/DPigeon/Money-Tree/actions
[docker-url]: https://www.docker.com/

## FAQ And Special Configurations

### Configuring the Linter

1. cd into the root directory of the project
2. Run the command

```
ln -s -f ../../hooks/pre-commit .git/hooks/pre-commit && chmod +x ./hooks/pre-commit
```

### Configure PlantUML for Diagrams

1. Download & install the PlantUML extension on VS code for the frontend or plugin on IntelliJ for the backend
2. Open the diagram directory on either client or backend in your IDE
3. Click on any .puml file you want to edit
4. Install the Graphviz library by following the instructions [here](https://plantuml.com/graphviz-dot)
5. Start using PlantUML and with the documentation [here](https://plantuml.com/)
