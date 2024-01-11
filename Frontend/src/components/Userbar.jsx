function Userbar({activeUsers, inactiveUsers}) {
    return (
        <>
            <div className="the-user-column">
                <ul className="active-users">
                    <h5>Online - {activeUsers.length}</h5>
                    {
                        activeUsers.map(aUser => (
                            <li>{aUser.username}</li>
                            )
                        )
                    }
                </ul>
                <ul className="inactive-users">
                    <h5>Offline - {inactiveUsers.length}</h5>
                    {
                        inactiveUsers.map(iUser => (
                            <li>{iUser.username}</li>
                            )
                        )
                    }
                </ul>
            </div>
        </>
    );
  }

export default Userbar;