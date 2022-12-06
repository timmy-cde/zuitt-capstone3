import { useEffect, useState } from "react";
import { Table, Accordion, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Users() {

    const [allUsers, setAllUsers] = useState([])
    const [userDisable, setUserDisable] = useState(false);
    const [adminDisable, setAdminDisable] = useState(false);
    const navigate = useNavigate();

    const setAsAdmin = (userId, firstName, lastName) => {
        fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/setAsAdmin`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

            if(data) {
                  Toast.fire({
                    icon: 'success',
                    title: `${firstName} ${lastName} is set as Admin!`
                  });

            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Something is wrong!'
                  });
            }
        })
    }

    const setAsUser = (userId, firstName, lastName) => {
        fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/setAsUser`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

            if(data) {
                  Toast.fire({
                    icon: 'success',
                    title: `${firstName} ${lastName} is set as User!`
                  });

            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Something is wrong!'
                  });
            }
        })
    }

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_URL}/users/all`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data);

            setAllUsers(data.map(user => {
                return (
                  <tr key={user._id}>
                    <td width={500}>
                      <Accordion flush>
                        <Accordion.Item eventKey={user._id}>
                          <Accordion.Header>
                            {user.firstName} {user.lastName}
                          </Accordion.Header>
                          <Accordion.Body>
                            <div>Email: {user.email}</div>
                            <div>Mobile No.: {user.mobileNo}</div>
                            <div>Address: {user.address}</div>
                            {/* <div className="pt-3 d-flex justify-content-end">
                              {!user.isAdmin ? (
                                <Button variant="success" size="sm" onClick={() => navigate('/user/orders')}>
                                  Orders
                                </Button>
                              ) : null}
                            </div> */}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </td>
                    <td className="text-center align-middle">
                      {user.isAdmin ? "Admin" : "User"}
                    </td>
                    <td className="text-center align-middle">
                      <div className="mb-2">
                        <Button
                          variant="info"
                          size="sm"
                          disabled={userDisable || !user.isAdmin}
                          onClick={() => {
                            setAsUser(user._id, user.firstName, user.lastName);
                            // setUserDisable(true);
                            // setAdminDisable(false);
                          }}
                        >
                          User
                        </Button>
                      </div>
                      <div>
                        <Button
                          variant="info"
                          size="sm"
                          disabled={adminDisable || user.isAdmin}
                          onClick={() => {
                            setAsAdmin(user._id, user.firstName, user.lastName);
                            // setAdminDisable(true);
                            // setUserDisable(false);
                          }}
                        >
                          Admin
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
            }))
        })
    }

    useEffect(() => {
        fetchData();
    })

    return (
      <>
        <div className="mx-0 mx-md-5">
          <h3 className="text-center pt-5">User Management</h3>
          <Table className="mt-5">
            <thead>
              <tr className="text-center">
                <th>Users</th>
                <th>Account Type</th>
                <th>Switch Account</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>{allUsers}</tbody>
          </Table>
        </div>
      </>
    );
}