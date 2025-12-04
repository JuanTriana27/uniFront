import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faUser,
    faFileContract,
    faListCheck,
    faBuilding,
    faHouseChimney,
    faDollarSign,
    faBars,
    faTimes,
    faBuildingShield,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ activeItem, setActiveItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const menuItems = [
        { name: "Home", icon: faHome },
        { name: "Persona", icon: faUser },
        { name: "Propiedad", icon: faHouseChimney },
        { name: "Estado Contrato", icon: faListCheck },
        { name: "Tipo Propiedad", icon: faBuilding },
        { name: "Estado Propiedad", icon: faBuildingShield },
        { name: "Venta Propiedad", icon: faDollarSign },
        { name: "Contrato Arrendamiento", icon: faFileContract },
    ];

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
        if (isMobile) {
            setIsOpen(false); // Cerrar sidebar en móvil después de hacer clic
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Botón hamburguesa solo en móvil */}
            {isMobile && (
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </button>
            )}

            {/* Overlay solo en móvil */}
            {isMobile && (
                <div
                    className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar - Siempre visible en desktop, controlado por isOpen en móvil */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <FontAwesomeIcon icon={faBuilding} className="sidebar-logo-icon" />
                        <span className="sidebar-logo-text">Gestión Inmobiliaria</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul className="sidebar-menu">
                        {menuItems.map((item) => (
                            <li key={item.name} className="sidebar-item">
                                <div
                                    className={`sidebar-link ${activeItem === item.name ? "active" : ""
                                        }`}
                                    onClick={() => handleItemClick(item.name)}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="sidebar-icon"
                                    />
                                    <span className="sidebar-text">{item.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;