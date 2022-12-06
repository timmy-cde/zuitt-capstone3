import {Row, Col, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <Row>
            <Col className="p-5 text-center">
                <h1>404 - Page not found</h1>
                <p>The page you are looking for cannot be found</p>
                <Button as={Link} to={"/"} variant="info">Back to Home</Button>
            </Col>
        </Row>
    )
}