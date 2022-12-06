import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { Person, BagDash, BoxArrowRight } from "react-bootstrap-icons";

import UserContext from "../UserContext";

export default function MobileUserDetails() {
    const {user} = useContext(UserContext);

    return (
      <>
      {/* {isDesktop ? <Navigate to={"/"}/> : <Navigate to={"/mobile-user-details"} />} */}
        {user.isAdmin ? (
          <>
            <ListGroup defaultActiveKey="/">
                {/* <ListGroup.Item
                  action
                  as={Link}
                  to={"/account"}
                  eventKey={"/account"}
                >
                  <Person className="align-center" size={18} />
                  <span>  My Account</span>
                </ListGroup.Item> */}
              <ListGroup.Item
                action
                as={Link}
                to={"/logout"}
                eventKey={"/logout"}
              >
                <BoxArrowRight className="align-center" size={18} />
                  <span>  Logout</span>
              </ListGroup.Item>
            </ListGroup>
          </>
        ) : (
          <>
          <ListGroup defaultActiveKey="/">
              {/* <ListGroup.Item
                action
                as={Link}
                to={"/account"}
                eventKey={"/account"}
              >
                <Person className="align-center" size={18} />
                <span>  My Account</span>
              </ListGroup.Item> */}
              <ListGroup.Item
                action
                as={Link}
                to={'/user/orders'}
                eventKey={'/user/orders'}
              >
                <BagDash className="align-center" size={18} />
                <span>  Orders</span>
              </ListGroup.Item>
              <ListGroup.Item
                action
                as={Link}
                to={"/logout"}
                eventKey={"/logout"}
              >
                <BoxArrowRight className="align-center" size={18} />
                <span>  Logout</span>
              </ListGroup.Item>
            </ListGroup>
          </>
        )}
      </>
    );
}