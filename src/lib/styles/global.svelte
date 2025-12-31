<style>
    :global {
        :root {
        --colorA: rgb(177, 60, 255);
        --colorB: rgb(98, 231, 81);
        --colorC: rgb(83, 153, 233);

        --panel: rgba(31, 31, 31, 0.6);
        --panel-outline: rgb(51, 51, 51);
        --panel-dark: rgb(14, 14, 14);
        }

        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
        }

        body {
            font-family: Verdana, sans-serif;
            background-color: black;
            color: white;
        }

        main {
            max-width: 1200px;
            padding: 25px 25px 0 25px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 95%;
        }

        input[type="text"] {
            display: block;
            color: white;
            padding: 5px;
            margin: 10px auto;
            width: 100%;
            max-width: 95vw;
            border: 2px solid var(--panel-outline);
            background-color: var(--panel-dark);
            border-radius: 5px;
            transition: 0.2s;
        }

        input[type="text"]:focus {
            outline: none;
            
            background-color: var(--panel);
        }

        button {
            background: var(--panel);
            min-width: 100px;
            color: white;
            border: var(--panel-outline) 2px solid;
            border-radius: 5px;
            padding: 5px 15px;
            cursor: pointer;
            transition: 0.2s;
        }

        button:hover {
            background: white;
            color: black;
        }

        a {
            color: white;
            transition: 0.2s;
        }

        a:hover {
            opacity: 0.8;
        }

        #site-content {
            animation: fade-in 2s;
            flex: 1;
        }

        .panel {
            background-color: var(--panel);
            border-radius: 10px;
        }

        .center-container {
            text-align: center;
            margin: 0 auto;
            max-width: 500px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .flex {
            display: flex;
            flex-direction: row;
        }
    }
</style>