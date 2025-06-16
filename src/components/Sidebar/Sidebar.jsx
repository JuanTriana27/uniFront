import React from 'react';
import './Sidebar.css';
import {
    People as PeopleIcon,
    Home as HomeIcon,
    Description as ContractIcon,
    AssignmentTurnedIn as StatusIcon,
    Category as TypeIcon,
    CheckCircle as PropertyStatusIcon,
    AttachMoney as SaleIcon
} from '@mui/icons-material';

const Sidebar = ({ activeItem, setActiveItem }) => {
    const menuItems = [
        { name: 'Persona', icon: <PeopleIcon /> },
        { name: 'Propiedad', icon: <HomeIcon /> },
        { name: 'Contrato Arrendamiento', icon: <ContractIcon /> },
        { name: 'Estado Contrato', icon: <StatusIcon /> },
        { name: 'Tipo Propiedad', icon: <TypeIcon /> },
        { name: 'Estado Propiedad', icon: <PropertyStatusIcon /> },
        { name: 'Venta Propiedad', icon: <SaleIcon /> }
    ];

    return (
        <div className="sidebar">
            <div className="logo-container">
                <div className="logo">Gestión Inmobiliaria</div>
            </div>

            <div className="menu-items">
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
                        onClick={() => setActiveItem(item.name)}
                    >
                        <div className="icon-container">{item.icon}</div>
                        <span className="item-name">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;