import React, { useState } from "react";
import { useEffect } from "react";

const LeadModal = ({active, handleModal, token, id, setErrorMessage }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [note, setNote] = useState("");

    const cleanFormData = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setCompany("");
        setNote("");
    };
    useEffect(() => {
        const getLead = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(`/api/leads/${id}`, requestOptions);
            if (!response.ok) {
                setErrorMessage("Can't get the lead")
            } else {
                const data = await response.json();
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setCompany(data.company);
                setEmail(data.email);
                setNote(data.note);
            }
        };
        if (id) {
            getLead();
        }
    }, [id, token]);

    const handleCreateLead = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                first_name: firstName, 
                last_name: lastName, 
                company: company, 
                email: email, 
                note: note,
            }),
            
        };
        const response = await fetch("/api/leads", requestOptions)
        if (!response.ok) {
            setErrorMessage("Something went wrong when creating lead");
        } else {
            cleanFormData();
            handleModal();
        }
    }

    const handleUpdateLead = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                first_name: firstName, 
                last_name: lastName, 
                company: company, 
                email: email, 
                note: note,
            }),
        };
        const response = await fetch(`/api/leads/${id}`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Something wrong with updating the lead");
        } else{
            cleanFormData();
            handleModal();
        };
    };

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">{id ? "Update Lead" : "Create Lead"} </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field"></div>
                        <label className="label">First Name</label>
                        <div className="control">
                            <input type="text" 
                                placeholder="enter first name"  
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                className="input"
                                required />
                        </div>
                        <div className="field"></div>
                        <label className="label">Last Name</label>
                        <div className="control">
                            <input type="text" 
                                placeholder="enter last name"  
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                className="input"
                                required />
                        </div>
                        <div className="field"></div>
                        <label className="label">Company</label>
                        <div className="control">
                            <input type="text" 
                                placeholder="enter company name"  
                                value={company} 
                                onChange={(e) => setCompany(e.target.value)} 
                                className="input"
                                required />
                        </div>
                        <div className="field"></div>
                        <label className="label">Email</label>
                        <div className="control">
                            <input type="email" 
                                placeholder="enter email"  
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="input"
                                required />
                        </div>
                        <div className="field"></div>
                        <label className="label">Note</label>
                        <div className="control">
                            <input type="text" 
                                placeholder="enter note"  
                                value={note} 
                                onChange={(e) => setNote(e.target.value)} 
                                className="input"
                                required />
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    {id ? (<button className="button is-info" onClick={handleUpdateLead}>Update</button>): 
                    (<button className="button is-primary" onClick={handleCreateLead}>Create</button>)}
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default LeadModal;