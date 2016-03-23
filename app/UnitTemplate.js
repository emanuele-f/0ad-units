'use strict';

var UNIT_TEMPLATE = `
    <td><img class='emblem' src="{{unit.Civilization.Emblem}}" title="{{unit.Civilization.Name}} emblem"/></td>
    <td title='Civilization.Name'>{{unit.Civilization.Name}}</td>
    <td><img class='unitIcon' src="{{unit.Identity.Icon}}" title="{{unit.Identity.History}}"/></td>
    <td title='Identity.GenericName'><b>{{unit.Identity.GenericName}}</b></td>
    <td title='Identity.SpecificName'><i>{{unit.Identity.SpecificName}}</i></td>
    <td valign="top">
        <table class='table-bordered unitPropTable'>
            <thead>
                <th></th>
                <th><img class='inverted' src='img/hack.png' title='Hack'/></th>
                <th><img class='inverted' src='img/pierce.png' title='Pierce'/></th>
                <th><img class='inverted' src='img/crush.png' title='Crush'/></th>
                <th><img class='inverted' src='img/minrange.png' title='MinRange'/></th>
                <th><img class='inverted' src='img/maxrange.png' title='MaxRange'/></th>
                <th><img class='inverted' src='img/preparetime.png' title='PrepareTime'/></th>
                <th><img class='inverted' src='img/repeattime.png' title='RepeatTime'/></th>
            </thead>
            <tbody>
                <tr>
                    <th><img class='inverted' title='Melee' src='img/melee.png'/></th>
                    <td title='Attack.Melee.Hack'>{{unit.Attack.Melee.Hack}}</td>
                    <td title='Attack.Melee.Pierce'>{{unit.Attack.Melee.Pierce}}</td>
                    <td title='Attack.Melee.Crush'>{{unit.Attack.Melee.Crush}}</td>
                    <td title='Attack.Melee.MinRange'>{{unit.Attack.Melee.MinRange}}</td>
                    <td title='Attack.Melee.MaxRange'>{{unit.Attack.Melee.MaxRange}}</td>
                    <td title='Attack.Melee.PrepareTime'>{{unit.Attack.Melee.PrepareTime}}</td>
                    <td title='Attack.Melee.RepeatTime'>{{unit.Attack.Melee.RepeatTime}}</td>
                </tr>
                <tr>
                    <th><img class='inverted' title='Ranged' src='img/ranged.png'/></th>
                    <td title='Attack.Ranged.Hack'>{{unit.Attack.Ranged.Hack}}</td>
                    <td title='Attack.Ranged.Pierce'>{{unit.Attack.Ranged.Pierce}}</td>
                    <td title='Attack.Ranged.Crush'>{{unit.Attack.Ranged.Crush}}</td>
                    <td title='Attack.Ranged.MinRange'>{{unit.Attack.Ranged.MinRange}}</td>
                    <td title='Attack.Ranged.MaxRange'>{{unit.Attack.Ranged.MaxRange}}</td>
                    <td title='Attack.Ranged.PrepareTime'>{{unit.Attack.Ranged.PrepareTime}}</td>
                    <td title='Attack.Ranged.RepeatTime'>{{unit.Attack.Ranged.RepeatTime}}</td>
                </tr>
                <tr>
                    <th><img class='inverted' title='Charge' src='img/charge.png'/></th>
                    <td title='Attack.Charge.Hack'>{{unit.Attack.Charge.Hack}}</td>
                    <td title='Attack.Charge.Pierce'>{{unit.Attack.Charge.Pierce}}</td>
                    <td title='Attack.Charge.Crush'>{{unit.Attack.Charge.Crush}}</td>
                    <td title='Attack.Charge.MinRange'>{{unit.Attack.Charge.MinRange}}</td>
                    <td title='Attack.Charge.MaxRange'>{{unit.Attack.Charge.MaxRange}}</td>
                    <td title='Attack.Charge.PrepareTime'>{{unit.Attack.Charge.PrepareTime}}</td>
                    <td title='Attack.Charge.RepeatTime'>{{unit.Attack.Charge.RepeatTime}}</td>
                </tr>
            </tbody>
        </table>
    </td>
    <td valign="top">
        <table class='table-bordered unitPropTable'>
            <thead>
                <th><img class='inverted' src='img/hack.png' title='Hack'/></th>
                <th><img class='inverted' src='img/pierce.png' title='Pierce'/></th>
                <th><img class='inverted' src='img/crush.png' title='Crush'/></th>
            </thead>
            <tbody>
                <tr>
                    <td title='Armour.Hack'>{{unit.Armour.Hack}}</td>
                    <td title='Armour.Pierce'>{{unit.Armour.Pierce}}</td>
                    <td title='Armour.Crush'>{{unit.Armour.Crush}}</td>
                </tr>
            </tbody>
        </table>
    </td>
    <td valign="top">
        <table class='table-bordered unitPropTable'>
            <thead>
                <th><img class='inverted' src='img/health.png' title='Health'/></th>
                <th><img class='inverted' src='img/walkspeed.png' title='WalkSpeed'/></th>
                <th><img class='inverted' src='img/runspeed.png' title='RunSpeed'/></th>
                <th><img src='img/bonus.png' title='Bonus vs Cavallery'/></th>
            </thead>
            <tbody>
                <tr>
                    <td title='Health'>{{unit.Health}}</td>
                    <td title='WalkSpeed'>{{unit.WalkSpeed}}</td>
                    <td title='RunSpeed'>{{unit.RunSpeed}}</td>
                    <td title='Bonuses.BonusCavMelee'>{{unit.Bonuses.BonusCavMelee}}x</td>
                </tr>
            </tbody>
        </table>
    </td>
    <td valign="top">
        <table class='table-bordered unitPropTable'>
            <thead>
                <th><img src='img/food.png' title='Food'/></th>
                <th><img src='img/wood.png' title='Wood'/></th>
                <th><img src='img/stone.png' title='Stone'/></th>
                <th><img src='img/metal.png' title='Metal'/></th>
                <th><img class='inverted' src='img/population.png' title='Population'/></th>
            </thead>
            <tbody>
                <tr>
                    <td title='Cost.Food'>{{unit.Cost.Food}}</td>
                    <td title='Cost.Wood'>{{unit.Cost.Wood}}</td>
                    <td title='Cost.Stone'>{{unit.Cost.Stone}}</td>
                    <td title='Cost.Metal'>{{unit.Cost.Metal}}</td>
                    <td title='Cost.Population'>{{unit.Cost.Population}}</td>
                </tr>
            </tbody>
        </table>
    </td>
`;
