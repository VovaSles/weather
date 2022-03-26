import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Button, Badge, Container, Row, Col, Form, FormControl, ListGroup, Modal, Spinner } from 'react-bootstrap'
import { clearOptionsAction, setErrorAction, setAutocompleteOptionsAction, addToFavoritesAction, changeCityAction } from '../redux/reducer'
import { fetchAutocompleteOptions, fetchWeather } from '../redux/asyncActions'
import { Heart } from "react-bootstrap-icons"



const SearchPage = () => {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites);
    const city = useSelector(state => state.city);
    const weather = useSelector(state => state.cityWeather);
    const daysWeather = useSelector(state => state.daysWeather);
    const error = useSelector(state => state.error);
    const loading = useSelector(state => state.loading)
    const [inputValue, setInputValue] = useState("");
    const options = useSelector(state => state.options)

    const cityClickHandler = (city) => {
        dispatch(fetchWeather(city.Key));
        dispatch(changeCityAction(city));
    }

    const getWeekDat = (date) => {
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const d = new Date(date)
        return weekday[d.getDay()]
    }
    if (error) {
        return <Modal.Dialog className="justify-content-center">
            <Modal.Body>
                {error.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => dispatch(setErrorAction(null))}>Close</Button>
            </Modal.Footer>
        </Modal.Dialog>
    } else if (loading) {
        return <Spinner className="justify-content-center" animation="border" variant="primary" />
    } else {
        return (
            <>
                <Container>
                    <Row>
                        <Col xs={12} md={12}>
                            <Form className=' m-auto mt-5'>
                                <Form.Group className="mb-3 mt-3">
                                    <FormControl
                                        id="search"
                                        placeholder="Search ..."
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                            <ListGroup>
                                {options.map(city => <ListGroup.Item variant="secondary" key={city.Key} onClick={() => cityClickHandler(city)}>{city.LocalizedName}</ListGroup.Item>)}
                            </ListGroup>
                            <Card className='  mt-5' >
                                <Card.Body>
                                    <Card.Title>
                                        <Row className='mt-5 justify-content-center'>
                                            <Col xs={12} md={{ span: 4 }}>
                                                <h2 className="text-center m-auto">
                                                    {city.LocalizedName}
                                                    <Badge bg="secondary" className='m-3'>
                                                        {weather.Temperature.Metric.Value}
                                                        {weather.Temperature.Metric.Unit}
                                                    </Badge>
                                                </h2>
                                            </Col>
                                            <Col xs={{ span: 6, offset: 4 }} md={{ span: 2, offset: 6 }}>
                                                {console.log(favorites)}
                                                {favorites.includes(city) ? <Heart color="red" size={40} />
                                                    : <Button
                                                        variant="primary"
                                                        onClick={() => dispatch(addToFavoritesAction(city))}>Like</Button>
                                                }
                                            </Col>
                                        </Row>
                                    </Card.Title>
                                    <h1 className="text-center m-auto" >{weather.WeatherText}</h1>
                                    <Row xs={1} md={5} className="g-5 m-3">
                                        {daysWeather.map((d, idx) => (
                                            <Col key={d.EpochDate}>
                                                <Card className="text-center" bg="warning">
                                                    <Card.Body>
                                                        <Card.Title>{getWeekDat(d.Date)}</Card.Title>
                                                        <h5> {d.Temperature.Maximum.Value}
                                                            {d.Temperature.Maximum.Unit}
                                                        </h5>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default SearchPage