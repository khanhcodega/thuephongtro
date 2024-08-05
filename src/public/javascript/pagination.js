function paginationFunction(totalPage, pageNumber) {
    let beforePage = Math.max(pageNumber - 1, 1),
        afterPage = Math.min(pageNumber + 1, totalPage);
    let listTag = '';

    if (pageNumber > 1) {
        listTag += `<li class="prev btn" onclick="paginationFunction(${totalPage}, ${pageNumber - 1})">
        <a page-number="${pageNumber - 1}"><span>&laquo;</span></a></li>`;
    }

    if (pageNumber > 2) {
        listTag += `<li class="btn" onclick="paginationFunction(${totalPage}, 1)">
         <a page-number="1"><span>1</span></a></li>`;
        if (pageNumber > 3) {
            listTag += `<li class="dots"><span>...</span></li>`;
        }
    }

    if (totalPage >= 4) {
        if (pageNumber == totalPage) {
            beforePage = Math.max(totalPage - 3, 1);
        } else if (pageNumber == totalPage - 1) {
            beforePage = Math.max(totalPage - 4, 1);
        }
        if (pageNumber == 1) {
            afterPage = Math.min(4, totalPage);
        } else if (pageNumber == 2) {
            afterPage = Math.min(5, totalPage);
        }
    }

    for (let index = beforePage; index <= afterPage; index++) {
        if (totalPage < index || index < 1) {
            continue;
        }

        let active = pageNumber === index ? 'active' : '';
        listTag += `<li class="btn" onclick="paginationFunction(${totalPage}, ${index})"> <a  class=" ${active}" page-number="${index}"><span>${index}</span></a></li>`;
    }

    if (pageNumber < totalPage - 1) {
        if (pageNumber < totalPage - 2) {
            listTag += `<li class="dots"><span>...</span></li>`;
        }
        listTag += `<li class="btn" onclick="paginationFunction(${totalPage}, ${totalPage})"> <a page-number="${totalPage}"><span>${totalPage}</span></a></li>`;
    }

    if (pageNumber < totalPage) {
        listTag += `<li class="next btn" onclick="paginationFunction(${totalPage}, ${pageNumber + 1})">
        <a page-number="${pageNumber + 1}"><span>&raquo;</span></a></li>`;
    }

    return listTag;
}

// export {paginationFunction}
