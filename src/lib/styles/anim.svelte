<style>
    @keyframes -global-flash {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes -global-fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes -global-slide-in-left {
        0% {
            opacity: 0;
            transform: translateX(-35%);
        }
        100% {
            opacity: 1;
            transform:  translateX(0%);
        }
    }

    @keyframes -global-slide-in-bottom {
        0% {
            opacity: 0;
            transform: translateY(100%);
        }
        100% {
            opacity: 1;
            transform:  translateY(0%);
        }
    }

    @keyframes -global-bg-scroll-x {
        0% {
            background-position-x: 0%;
        }
        100% {
            background-position-x: -250%;
        }
    }
    
</style>