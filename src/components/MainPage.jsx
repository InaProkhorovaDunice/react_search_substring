import React, { useState, useRef } from 'react';
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
    registrationForm: {
        textAlign: "center",
        margin: "10px",
    },
    underlined: {
        textDecoration: "underline",
    },
    alert: {
        position: "absolute",
        top: "32px",
        width: "100%",
    },
    mainSpace: {
        width: "100%",
        height: "calc(100% - 90px)",
        position: "absolute",
        top: "64px",
        left: "0",
        overflow: "auto",
    },
    centralForm: {
        width: "250px",
        height: "250px",
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        margin: "auto",
    },
    requestTable: {
        width: "650px",
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        margin: "auto",
    },
    tableTitle: {
        marginBottom: "20px",
        marginTop: "50px",
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
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [passwordConfirmValue, setPasswordConfirmValue] = useState('');
    const [resetPassValue, setResetPassValue] = useState('');
    const [resetPassConfirmValue, setResetPassConfirmValue] = useState('');
    const [searchStringValue, setSearchStringValue] = useState('');
    const [substringValue, setSubstringValue] = useState('');
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

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
        (val3 || val4 || val5) && authentificateUser();
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
       API.logIn(localStorage.getItem('uid'), localStorage.getItem('password'))
    };


    const LogIn = function () {
        let email = emailValue;
        let password = passwordValue;
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

    const SignUp = function () {
        let email = emailValue;
        let password = passwordValue;
        let passwordConfirmation = passwordConfirmValue;
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
        let password = resetPassValue;
        let passwordConfirmation = resetPassConfirmValue;
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
        let searchString = searchStringValue;
        let substring = substringValue;
        if (searchString && substring) {
            API.searchSubstring(searchString, substring)
                .then(() => {
                    if (localStorage.getItem('request-error') === 'true') {
                        setErrorMessage("Incorrect search query!");

                    } else {
                        setSearchResult(JSON.parse(localStorage.getItem('searchResult')));
                    }})
        } else {setErrorMessage("Enter Search string and substring!");}
        authentificateUser();
    };

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
        id && API.deleteSearchRequest(id)
            .then(() => {
                localStorage.getItem('request-error') === 'false' && getRequests();
            })
    };

    return (
            <div className={classes.mainPage}>
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

                <div className={classes.alert}>
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

                <div className={classes.mainSpace}>
                    <div className={classes.centralForm}>
                        {showSearchQuery &&
                            <form className={classes.loginForm} noValidate autoComplete="off">
                                <Typography variant="h6" component="h2">
                                    Make a search query
                                </Typography>
                                <TextField value={searchStringValue} id="standard-basic" label="Search string" onChange={e => setSearchStringValue(e.target.value)} />
                                <TextField value={substringValue} id="standard-basic" label="Substring" onChange={e => setSubstringValue(e.target.value)} />
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
                                <TextField value={emailValue} id="standard-basic" label="Email" onChange={e => setEmailValue(e.target.value)} />
                                <TextField value={passwordValue} id="standard-basic" label="Password" onChange={e => setPasswordValue(e.target.value)} />
                                {showSignUpForm &&
                                    <TextField value={passwordConfirmValue} id="standard-basic" label="Password confirmation" onChange={e => setPasswordConfirmValue(e.target.value)} />
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
                                <TextField value={resetPassValue} id="standard-basic" label="Password" onChange={e => setResetPassValue(e.target.value)} />
                                <TextField value={resetPassConfirmValue} id="standard-basic" label="Password confirmation" onChange={e => setResetPassConfirmValue(e.target.value)} />
                                <div className={classes.loginButton}>
                                    <Button variant="contained" color="primary" onClick={resetPassword}>
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        }

                    </div>
                    {showRequestHistory &&
                        <div className={classes.requestTable}>
                            <Typography variant="h6" component="h2" className={classes.tableTitle}>Request history</Typography>
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
                                                <TableCell align="left">{row.search_string}</TableCell>
                                                <TableCell align="right">{row.substring}</TableCell>
                                                <TableCell align="right">
                                                    {row.result_data.length > 0
                                                        &&
                                                        row.result_data[0] === 'No'
                                                        ?
                                                        'No'
                                                        :
                                                        row.result_data.map((el) => <span className={el.underlined ? classes.underlined : ""}>{el.substring}</span>)}
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

