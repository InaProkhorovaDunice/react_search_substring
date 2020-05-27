import React, { useState, useRef } from 'react';
import axios from 'axios';
import './MainPage.scss'
import API from './utils/API'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import { Alert, AlertTitle } from '@material-ui/lab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    paper: {
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    mainPaper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(70),
            height: theme.spacing(70),
        },
    },
    loginForm: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    loginButton: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    table: {
        minWidth: 650,
        textAlign: 'left'
    },
}));

export default function MainPage() {
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showSearchQuery, setShowSearchQuery] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showRequestHistory, setShowRequestHistory] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchHistoryData, setSearchHistoryData] = useState([]);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const confirmPasswordRef = React.useRef(null);
    const searchStringRef = React.useRef(null);
    const substringRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const updateVisibilityConditions = function (val1, val2, val3, val4, val5, val6) {
        setOpen(false);
        setSearchResult([]);
        (val4 || val5) && authentificateUser();
        setShowLoginForm(val1);
        setShowSignUpForm(val2);
        setShowResetPassword(val3);
        setShowSearchQuery(val4);
        setShowRequestHistory(val5);
        setSuccessMessage(val6);
    };


    const LogOut = function () {
        API.logOut()
            .then(() => {
                if (localStorage.getItem('request-error') === 'true') {
                    setErrorMessage( "Login or sign up before log out!");
                } else {
                    updateVisibilityConditions(true, false,false, false, false, 'You have successfully logged out!');
                }
            })
    };

    const authentificateUser = function () {
       API.logIn(localStorage.getItem('uid'), localStorage.getItem('password'));
    };


    const LogIn = function () {
        let email = receiveTextFormValue(emailRef);
        let password = receiveTextFormValue(passwordRef);
        if (email && password) {
            API.logIn(email, password)
                .then(() => {
                    if (localStorage.getItem('request-error') === 'true') {
                        setErrorMessage("Incorrect email or password!");
                    } else {
                        updateVisibilityConditions(false, false, false, true, false, 'You have successfully logged in!');
                    }
                })

        } else {
            setErrorMessage("Enter email and password!")
        }
    };

    const receiveTextFormValue = function (ref) {
        return ref.current && ref.current.children[1] && ref.current.children[1].children[0] && ref.current.children[1].children[0].value;
    };

    const SignUp = function () {
        let email = receiveTextFormValue(emailRef);
        let password = receiveTextFormValue(passwordRef);
        let passwordConfirmation = receiveTextFormValue(confirmPasswordRef);
        if ( email && password && passwordConfirmation) {
            API.signUp(email, password, passwordConfirmation)
                .then(() => {
                    if (localStorage.getItem('request-error') === 'true') {
                        setErrorMessage("Incorrect email format or password(should be at least 6 characters)");
                    } else {
                        updateVisibilityConditions(false, false, false, true, false, 'You have successfully signed up!');
                    }
                })
        } else {
            setErrorMessage("Enter email, password and password confirmation!")
        }
    };

    const resetPassword = function () {
        let password = receiveTextFormValue(passwordRef);
        let passwordConfirmation = receiveTextFormValue(confirmPasswordRef);
        if (password && passwordConfirmation) {
            API.resetPassword(password, passwordConfirmation)
                .then(() => {
                    if (localStorage.getItem('request-error') === 'true') {
                        setErrorMessage("Incorrect password or password confirmation");
                    } else {
                        authentificateUser();
                        updateVisibilityConditions(false, false, false, true, false, 'The password was successfully reset');
                    }
                })
        } else {
            setErrorMessage("Enter password and password confirmation!");
        }
    };

    const makeRequest = function () {
        let searchString = receiveTextFormValue(searchStringRef);
        let substring = receiveTextFormValue(substringRef);
        if (searchString && substring) {
            API.searchSubstring(searchString, substring)
                .then(() => {
                    if (localStorage.getItem('request-error') === 'true') {
                        setErrorMessage("Incorrect search query!");

                    } else {
                        debugger
                        setSearchResult(JSON.parse(localStorage.getItem('searchResult')));
                    }})
        } else {setErrorMessage("Enter Search string and substring!");}
        authentificateUser();
    }

    const getRequests = function () {
        setOpen(false);
        authentificateUser();
        API.gerRequestHistory()
            .then(() => {
                setSearchHistoryData(JSON.parse(localStorage.getItem('requestHistory')));
                updateVisibilityConditions(false, false, false, false, true, '')
            })
    };

    const deleteRequest = function (id) {
        axios.delete('/request/delete_request',  {headers: {"uid": localStorage.getItem("uid"), client: localStorage.getItem("client"), 'access-token': localStorage.getItem("access-token")}, params: {id: id}})
            .then(() => {
                if (localStorage.getItem('request-error') === 'true') {
                    setErrorMessage('Such request does not exist!');
                } else {
                    setSuccessMessage('Request has been successfully deleted!');
                    getRequests();
                };
            })
    };

    return (
            <div className="MainPage">
                <AppBar position="absolute">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            String Calculation
                        </Typography>
                        <Typography variant="h6" className={classes.title}>
                            {localStorage.getItem("uid")}
                        </Typography>
                        <Button
                            ref={anchorRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                        >
                            <Avatar src="/broken-image.jpg" />
                        </Button>
                        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                <MenuItem onClick={() => updateVisibilityConditions(true, false, false, false, false, '')}>LogIn</MenuItem>
                                                <MenuItem onClick={() => updateVisibilityConditions(false, true, false, false, false, '')}>SignUp</MenuItem>
                                                {localStorage.getItem('uid') &&
                                                    <div>
                                                        <MenuItem onClick={() => updateVisibilityConditions(false, false, false, true, false, '')}>New request</MenuItem>
                                                        <MenuItem onClick={LogOut}>LogOut</MenuItem>
                                                        <MenuItem onClick={() => updateVisibilityConditions(false, false, true, false, false, '')}>Reset password</MenuItem>
                                                        <MenuItem onClick={() => getRequests()}>Request history</MenuItem>
                                                    </div>
                                                }
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Toolbar>
                </AppBar>

                <div className={"alert"}>
                    <div className={classes.alert}>
                        {errorMessage &&
                            <ClickAwayListener onClickAway={() => setErrorMessage('')}>
                                <Alert severity="error">
                                    <AlertTitle>{errorMessage}</AlertTitle>
                                </Alert>
                            </ClickAwayListener>
                        }
                        {successMessage &&
                            <ClickAwayListener onClickAway={() => setSuccessMessage('')}>
                                <Alert severity="success">
                                    <AlertTitle>{successMessage}</AlertTitle>

                                </Alert>
                            </ClickAwayListener>
                        }
                    </div>
                </div>

                <div className={"mainSpace"}>
                    <div className={'centralForm'}>
                        {showSearchQuery &&
                        <form className={classes.loginForm} noValidate autoComplete="off">
                            <Typography variant="h6" component="h2">
                                Make a search query
                            </Typography>
                            <TextField ref={searchStringRef} id="standard-basic" label="Search string" />
                            <TextField ref={substringRef} id="standard-basic" label="Substring" />
                            <div className={classes.loginButton}>
                                <Button variant="contained" color="primary" onClick={makeRequest}>
                                    Search
                                </Button>
                            </div>
                            <Typography variant="h6" component="h2">
                                {searchResult.length > 0 ? (searchResult[0] === 'No' ? 'No' : 'Yes') : ''}
                            </Typography>
                            <Typography variant="h6" component="h2">
                                {searchResult.map((el) => <span className={el.underlined ? "underlined" : ""}>{el.substring}</span>)}
                            </Typography>
                        </form>
                        }

                        {(showLoginForm || showSignUpForm)  &&
                            <form className={classes.loginForm} noValidate autoComplete="off">
                                {showLoginForm
                                    ?
                                    <Typography variant="h6" component="h2">
                                        Login
                                    </Typography>
                                    :
                                    <Typography variant="h6" component="h2">
                                        Sign up
                                    </Typography>
                                }
                                <TextField ref={emailRef} id="standard-basic" label="Email" />
                                <TextField ref={passwordRef} id="standard-basic" label="Password" />
                                {showSignUpForm &&
                                    <TextField ref={confirmPasswordRef} id="standard-basic" label="Password confirmation" />
                                }
                                <div className={classes.loginButton}>
                                    {showLoginForm
                                        ?
                                        <Button variant="contained" color="primary" onClick={LogIn}>
                                            LogIn
                                        </Button>
                                        :
                                        <Button variant="contained" color="primary" onClick={SignUp}>
                                            Sign Up
                                        </Button>
                                    }
                                </div>
                            </form>
                        }

                        {showResetPassword &&
                            <form className={classes.loginForm} noValidate autoComplete="off">
                                <Typography variant="h6" component="h2">
                                    Reset password
                                </Typography>
                                <TextField ref={passwordRef} id="standard-basic" label="Password" />
                                <TextField ref={confirmPasswordRef} id="standard-basic" label="Password confirmation" />
                                <div className={classes.loginButton}>
                                    <Button variant="contained" color="primary" onClick={resetPassword}>
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        }


                    </div>
                    {showRequestHistory &&
                        <div className={"table"}>
                            <Typography variant="h6" component="h2" className={"tableTitle"}>Request history</Typography>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Search string</TableCell>
                                            <TableCell align="right">Substring</TableCell>
                                            <TableCell align="right">Result</TableCell>
                                            <TableCell align="right">Delete request</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {searchHistoryData.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="right">{row.search_string}</TableCell>
                                                <TableCell align="right">{row.substring}</TableCell>
                                                <TableCell align="right">
                                                    {row.result_data.length > 0
                                                        &&
                                                        row.result_data[0] === 'No'
                                                        ?
                                                        'No'
                                                        :
                                                        row.result_data.map((el) => <span className={el.underlined ? "underlined" : ""}>{el.substring}</span>)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button onClick={() => deleteRequest(row.id)}><DeleteOutlinedIcon /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    }
                </div>
            </div>
        );
}

